import { z } from 'zod'

import { getStore } from '@/lib/mcp/store'
import { defineTool } from '@/lib/mcp/tool-kit'

export const auditTools = [
  defineTool({
    name: 'list_recent_changes',
    title: 'List recent changes',
    description:
      'The latest writes made through this MCP server (any connection), newest first, with the record before and after (card faces as Card Markdown). Use it to review or undo earlier changes.',
    access: 'read',
    input: {
      limit: z.number().int().min(1).max(200).optional().describe('Default 20.'),
      collection: z.enum(['studies', 'subjects', 'topics', 'cards']).optional(),
      document_id: z.string().trim().min(1).max(64).optional(),
    },
    handler: async ({ limit, collection, document_id }) => {
      const rows = await getStore().listAudit(limit ?? 20, { collection, documentId: document_id })
      return rows.map(({ _id, ...row }) => ({ id: String(_id), ...row }))
    },
  }),
]
