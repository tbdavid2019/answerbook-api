## Context

The `answerbook-api` provides several useful features (answers, market data, vocabulary) via REST endpoints. However, LLMs need a more structured and discoverable way to use these. Modern LLMs support "skills" (markdown guides) and MCP (Model Context Protocol) for tool use.

## Goals / Non-Goals

**Goals:**
- Create structured skill guides in `.agent/skills/api-guides/` for LLMs.
- Update `README.md` for LLM discovery.
- Implement an MCP-compliant endpoint in the existing Hono app.

**Non-Goals:**
- Creating new API functionality.
- Changing existing API response formats.

## Decisions

1.  **Skill Organization**: Group APIs into four logical categories: `Answer Book`, `Market Data`, `Words Learning`, and `Utilities`. Each will have its own `.md` file with clear descriptions of parameters and example calls.
2.  **MCP Transport**: Use HTTP with JSON-RPC. While many MCP servers use stdio, an HTTP-based MCP server is more suitable for a Cloudflare Worker and can be accessed by remote LLMs if properly configured.
3.  **Hono Integration**: Add the MCP logic directly into `src/index.js` or a separate module imported by it, to minimize deployment complexity.

## Risks / Trade-offs

- **MCP Versatility**: Some LLM clients only support stdio MCP. For those, a separate bridge or local proxy might be needed, but providing an HTTP MCP endpoint is the best first step for a hosted service.
- **Maintenance**: Documentation in skill guides must be kept in sync with the code. (Using `zod-openapi` already helps for Swagger, but manual skill guides provide better context for LLMs).
