import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js'
import type { z, ZodRawShape } from 'zod'

import { MCP_SCOPES, type McpAuth } from '@/lib/mcp/oauth'
import { getStore } from '@/lib/mcp/store'
import { CardMarkdownError } from '@/lexical/markdown'

// Every MCP tool is a zod input shape plus a handler that goes through Payload's
// Local API as the signed-in user, so collection access rules and hooks (flat vs
// topical subjects, previews) apply exactly as in the admin. Read tools need
// cards:read, everything else cards:write; tools the token can't use are not listed.

export type ToolAccess = 'read' | 'write' | 'delete'

export interface ToolContext {
  auth: McpAuth
}

export interface ToolDefinition<Shape extends ZodRawShape = ZodRawShape> {
  name: string
  title: string
  description: string
  access: ToolAccess
  input: Shape
  handler: (_args: z.objectOutputType<Shape, z.ZodTypeAny>, _ctx: ToolContext) => Promise<unknown>
}

export function defineTool<Shape extends ZodRawShape>(def: ToolDefinition<Shape>): ToolDefinition {
  return def as unknown as ToolDefinition
}

// Expected failures (not found, validation). The message is shown to the agent.
export class ToolError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ToolError'
  }
}

export function canUse(def: ToolDefinition, scopes: string[]): boolean {
  return def.access === 'read' ? scopes.includes(MCP_SCOPES.READ) : scopes.includes(MCP_SCOPES.WRITE)
}

function textResult(data: unknown): CallToolResult {
  return { content: [{ type: 'text', text: JSON.stringify(data ?? null, null, 2) }] }
}

function errorResult(message: string): CallToolResult {
  return { isError: true, content: [{ type: 'text', text: message }] }
}

/** Payload ValidationError → "field: message" lines. */
function payloadErrorMessage(err: any): string | null {
  const errors = err?.data?.errors
  if (Array.isArray(errors) && errors.length) {
    return errors.map((e: any) => (e.path ? `${e.path}: ${e.message}` : e.message)).join('; ')
  }
  if (err?.name === 'NotFound' || err?.status === 404) return 'Record not found.'
  if (err?.name === 'Forbidden' || err?.status === 403) return 'Your account may not do this.'
  return null
}

export async function runTool(def: ToolDefinition, args: unknown, ctx: ToolContext): Promise<CallToolResult> {
  if (!canUse(def, ctx.auth.scopes)) {
    return errorResult(`This connection is read-only; ${def.name} needs the cards:write scope.`)
  }
  try {
    return textResult(await def.handler(args as never, ctx))
  } catch (err: any) {
    if (err instanceof ToolError || err instanceof CardMarkdownError) return errorResult(err.message)
    const payloadMessage = payloadErrorMessage(err)
    if (payloadMessage) return errorResult(payloadMessage)
    if (err?.code === 11000) return errorResult('A record with the same unique value already exists.')
    // Collection hooks throw plain Errors with user-facing messages (flat vs topical rules).
    console.error(`MCP tool ${def.name} failed:`, err)
    return errorResult(err?.message || 'Unknown error.')
  }
}

export function registerTools(server: McpServer, tools: ToolDefinition[], ctx: ToolContext) {
  for (const def of tools) {
    if (!canUse(def, ctx.auth.scopes)) continue
    server.registerTool(
      def.name,
      {
        title: def.title,
        description: def.description,
        inputSchema: def.input,
        annotations: {
          title: def.title,
          readOnlyHint: def.access === 'read',
          destructiveHint: def.access === 'delete',
          idempotentHint: def.access === 'read',
          openWorldHint: false,
        },
      },
      ((args: unknown) => runTool(def, args, ctx)) as never,
    )
  }
}

// ─── Audit log ──────────────────────────────────────────────────────────────

export type AuditAction = 'create' | 'update' | 'delete'

export async function audit(
  ctx: ToolContext,
  entry: { tool: string; action: AuditAction; collection: string; documentId: string; before?: unknown; after?: unknown },
) {
  await getStore().insertAudit({
    tool: entry.tool,
    action: entry.action,
    collection: entry.collection,
    document_id: entry.documentId,
    before: entry.before ?? null,
    after: entry.after ?? null,
    grant_id: ctx.auth.grantId,
    client_name: ctx.auth.clientName,
    email: ctx.auth.user.email,
  })
}

// Fields of `patch` that differ from `before`, for dry runs and change summaries.
export function diffFields(before: Record<string, any>, patch: Record<string, any>) {
  const changes: Record<string, { from: unknown; to: unknown }> = {}
  for (const key of Object.keys(patch)) {
    if (patch[key] === undefined) continue
    if (JSON.stringify(before[key] ?? null) !== JSON.stringify(patch[key] ?? null)) {
      changes[key] = { from: before[key] ?? null, to: patch[key] ?? null }
    }
  }
  return changes
}
