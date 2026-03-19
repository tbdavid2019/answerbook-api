## 1. Skill Guides Preparation

- [ ] 1.1 Create directory `.agent/skills/api-guides/`
- [ ] 1.2 Create `answer-book.md` with `/answers` and `/answersWithMeta` documentation.
- [ ] 1.3 Create `market-data.md` with `/SP500`, `/nasdaq100`, etc. documentation.
- [ ] 1.4 Create `words-learning.md` with `/words/*` and `/greWord` documentation.
- [ ] 1.5 Create `utilities.md` with `/RandomPassword`, `/TangPoetry`, `/TempleOracleJP` documentation.

## 2. Project Documentation

- [ ] 2.1 Update root `README.md` to include "AI & LLM Integration" section.
- [ ] 2.2 Add instructions for using the skill guides and MCP server.

## 3. MCP Server Implementation

- [ ] 3.1 Create `src/mcp.js` (or integrate into `src/index.js`) to handle MCP JSON-RPC requests.
- [ ] 3.2 Define MCP tools mapping to existing API functions.
- [ ] 3.3 Register the `/mcp` POST endpoint in the Hono app.

## 4. Verification

- [ ] 4.1 Verify all skill guides are readable and accurate.
- [ ] 4.2 Test the `/mcp` endpoint with a sample JSON-RPC tool list request.
- [ ] 4.3 Verify `README.md` links and sections.
