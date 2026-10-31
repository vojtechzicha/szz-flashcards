import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { CARD_MARKDOWN_GUIDE } from '@/lexical/markdown'
import type { McpAuth } from '@/lib/mcp/oauth'
import { registerTools, type ToolDefinition } from '@/lib/mcp/tool-kit'
import { auditTools } from '@/lib/mcp/tools/audit'
import { cardTools } from '@/lib/mcp/tools/cards'
import { structureTools } from '@/lib/mcp/tools/structure'

export const MCP_TOOLS: ToolDefinition[] = [...structureTools, ...cardTools, ...auditTools]

const INSTRUCTIONS = `Production data of Study Cards (flash.zicha.name), a flashcard study app. Content is mostly Czech; write new cards in the language of the deck.
Structure: study → subject → (topic) → card. A subject is either "flat" (cards attach to the subject) or "topical" (cards belong to topics under it). Start with list_studies, then get_study for subject/topic ids and card counts.
Cards: read with list_cards or search_cards, write with create_cards / update_cards (batches of up to 200). Check for duplicates with search_cards before adding. Cards are appended after existing ones unless you set order.
Writes go straight to production and to every learner's deck: use dry_run on bigger changes and confirm deletes with the user. Every write is logged; list_recent_changes shows the record before and after each change.

${CARD_MARKDOWN_GUIDE}`

// One server per request: the endpoint is stateless and the tool list depends on the token's scopes.
export function createMcpServer(auth: McpAuth) {
  const server = new McpServer({ name: 'study-cards', version: '1.0.0' }, { instructions: INSTRUCTIONS })
  registerTools(server, MCP_TOOLS, { auth })
  return server
}
