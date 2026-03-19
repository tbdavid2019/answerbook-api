## Why

The current system has many APIs (Answer Book, Utilities, Market Data, Words Learning) but lacks a structured way for LLMs to understand and invoke them. Providing dedicated "skill" guides and an MCP server will significantly improve the integration with modern AI coding assistants and LLM-powered tools.

## What Changes

1.  **Skill Guides**: Create a new folder `.agent/skills/api-guides/` containing separate `.md` files for different API categories (Answer Book, Market Data, Words Learning, Utilities).
2.  **README Update**: Update the project root `README.md` to include a section guiding LLMs to these skill guides.
3.  **MCP Server**: Implement a Model Context Protocol (MCP) server that exposes these APIs as tools, allowing compatible LLMs (like Claude, Codex) to call them directly.

## Capabilities

### New Capabilities
- `api-skill-guides`: Structured documentation for LLMs explaining how to call existing APIs.
- `mcp-server`: A standard interface for LLMs to interact with the system's APIs.

### Modified Capabilities
- `project-readme`: Updated to reflect the new AI-friendly discovery mechanisms.

## Impact

- New folder `.agent/skills/api-guides/`
- Update to `README.md`
- New file(s) for MCP server implementation (e.g., `src/mcp.js` or similar).
