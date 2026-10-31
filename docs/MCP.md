# Claude connector (remote MCP)

The app serves a remote [MCP](https://modelcontextprotocol.io) server at `/api/mcp`. Add it to Claude once and every
Claude session (claude.ai chat, Claude Code in any repo, desktop, mobile) can read and edit the decks in production.

## Connect

**claude.ai** (also covers the desktop and mobile apps and Claude Code cloud sessions): Settings → Connectors → Add
custom connector, URL `https://flash.zicha.name/api/mcp`. Claude opens the app's consent page; sign in with Google,
choose "Read and edit" or "Read only", and approve.

**Claude Code in a terminal:**

```bash
claude mcp add --transport http --scope user study-cards https://flash.zicha.name/api/mcp
```

Then run `/mcp` in Claude Code and authenticate.

The "Claude" link in the app header (`/app/connections`) shows the connector address and every connected app.
"Disconnect" revokes an app immediately.

## Tools

| Area | Tools |
| --- | --- |
| Structure | `list_studies`, `get_study` (subjects, topics and card counts in one call) |
| Studies | `create_study`, `update_study`, `delete_study` |
| Subjects | `create_subject`, `update_subject`, `delete_subject` |
| Topics | `create_topic`, `update_topic`, `delete_topic` |
| Cards | `list_cards`, `search_cards`, `create_cards`, `update_cards`, `delete_cards` (batches of up to 200) |
| Helpers | `preview_card_markdown`, `list_recent_changes` |

Every tool goes through Payload's Local API as the connector's user with access control on, so the collection rules
and hooks apply exactly as in the admin (admin-only writes, flat vs topical placement, `preview` generation). Updates
and deletes take `dry_run`. Batch writes validate every item (placement, Markdown, KaTeX) before saving any of them.
New cards are appended after the last card of their topic or flat subject unless `order` is given. Deleting cards
also deletes everyone's progress rows for them.

## Card Markdown

Card faces (`front`, `back`) are Lexical rich text. Tools exchange them as Card Markdown
(`src/lexical/markdown.ts`), which maps one-to-one onto what the card editor can produce:

| Markdown | Lexical |
| --- | --- |
| blank line / single newline | new paragraph / line break |
| `### Heading`, `#### Heading` | h3, h4 |
| `- item`, `1. item`, indent 2 spaces to nest | bullet / numbered list |
| `**bold**`, `*italic*`, `~~strike~~`, `` `code` `` | text formats |
| `<u>…</u>`, `<sub>…</sub>`, `<sup>…</sup>` | underline, subscript, superscript |
| `[text](https://…)` | link |
| `$…$` | `mathInline` block (KaTeX) |
| `$$ … $$` on its own line(s) | `math` block (display) |
| `<tag>Label</tag>` | `tag` inline block |
| ` ```lang ` … ` ``` ` fence at line start | `code` block (verbatim, monospace `<pre>`) |
| `\*`, `\$`, `\_`, … | literal character |

Reading a card and writing the same Markdown back preserves its structure; the test suite checks this for all 302
legacy cards. A card holding something Markdown can't express (text alignment, colours, foreign nodes) is returned
with `not_representable`, because rewriting that face would drop it. Math that KaTeX can't parse rejects the batch
unless `allow_math_errors` is set.

## Safety

- **Audit log**: every write is stored in the `mcp_audit` collection with the record before and after (cards as
  Markdown; cascaded deletes keep the deleted cards). `list_recent_changes` reads it; use it to review or undo.
- **Who**: the Payload `users` collection is the allow-list. Sign-in goes through the app's normal login (Google or
  password). The user is reloaded on every MCP request, so deleting a user cuts off their connectors, and only
  admins get write tools (demoting an admin removes them on the next request).
- **Scopes**: `cards:read`, or `cards:read cards:write`, chosen on the consent page. Read-only connections don't see
  write tools at all. Tools are annotated read-only / destructive, so Claude asks before deleting.
- **Tokens**: access tokens last 1 hour, refresh tokens 60 days and rotate on every use; reusing an old refresh
  token revokes the whole connection. Codes and tokens are stored only as SHA-256 hashes; TTL indexes prune them.
- **Redirects**: clients may only register Claude's callbacks (`https://claude.ai/api/mcp/auth_callback`,
  `https://claude.com/api/mcp/auth_callback`) and loopback addresses (Claude Code). `MCP_EXTRA_REDIRECT_URIS`
  (comma-separated) adds more, e.g. for the MCP Inspector.

## How it works

```
Claude ── POST /api/mcp (Bearer) ──▶ src/app/api/mcp/route.ts ─▶ src/lib/mcp/server.ts ─▶ src/lib/mcp/tools/* ─▶ Payload Local API
   │ 401 + resource_metadata
   ├─▶ /.well-known/oauth-protected-resource/api/mcp   (RFC 9728)
   ├─▶ /.well-known/oauth-authorization-server         (RFC 8414)
   ├─▶ POST /api/mcp/oauth/register                    (dynamic client registration, RFC 7591)
   ├─▶ /oauth/authorize                                (app sign-in + consent, PKCE S256)
   ├─▶ POST /api/mcp/oauth/token                       (authorization_code, refresh_token)
   └─▶ POST /api/mcp/oauth/revoke                      (RFC 7009)
```

- `src/lib/mcp/oauth.ts`: authorization server (registration, codes, tokens, verification). Ported from zicha-study.
- `src/lib/mcp/store.ts`: `mcp_clients`, `mcp_auth_codes`, `mcp_grants`, `mcp_tokens`, `mcp_audit`, plain MongoDB
  collections on Payload's connection (not Payload collections, so they stay out of the admin).
- `src/lib/mcp/tool-kit.ts`: tool definition, scope filtering, error mapping, audit helper.
- `src/lib/mcp/content.ts`: Local API helpers, record shapes, card placement rules.
- `src/lib/mcp/actions.ts`: Server Actions for the consent page and `/app/connections`.

The endpoint is stateless (a new MCP server per request, JSON responses), which fits Vercel functions. The issuer and
resource URLs come from the request host; set `MCP_PUBLIC_URL` if a proxy hides it. Tokens are bound to the origin
that issued them, so a production token doesn't work on a preview deployment.

The consent page is reached by a cross-site redirect from Claude. Payload ignores its own auth cookie on cross-site
requests (CSRF check), so a user signed in only with a password is sent through `/sign-in`, which is same-origin and
redirects straight back. Google sessions (Auth.js) are recognised directly.

## Testing locally

```bash
pnpm dev
npx @modelcontextprotocol/inspector
```

In the Inspector, connect to `http://localhost:3000/api/mcp` with Streamable HTTP. Its callback is a loopback
address, so it registers without extra configuration.

Unit tests: `src/lib/mcp/__tests__/oauth.test.ts` (OAuth flow, in-memory store) and `src/lexical/markdown.test.ts`
(Card Markdown, including the legacy-deck round trip).
