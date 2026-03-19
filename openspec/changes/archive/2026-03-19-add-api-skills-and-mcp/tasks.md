## 1. Skill Guides Preparation

- [x] 1.1 Create directory `skills/` (at project root)
- [x] 1.2 Create `skills/answer-book/SKILL.md` with `/answers` and `/answersWithMeta` documentation.
- [x] 1.3 Create `skills/market-data/SKILL.md` with `/SP500`, `/nasdaq100`, etc. documentation.
- [x] 1.4 Create `skills/words-learning/SKILL.md` with `/words/*` and `/greWord` documentation.
- [x] 1.5 Create `skills/utilities/SKILL.md` with `/RandomPassword`, `/TangPoetry`, `/TempleOracleJP` documentation.

## 2. Project Documentation

- [x] 2.1 Update root `README.md` to include "AI & LLM Integration" section.
- [x] 2.2 Add instructions for using the skill guides and MCP server.

## 3. MCP Server Implementation

- [x] 3.1 Create `src/mcp.js` to handle MCP JSON-RPC requests.
- [x] 3.2 Define MCP tools mapping to existing API functions (10 tools).
- [x] 3.3 Register the `/mcp` POST endpoint in the Hono app.

## 4. Verification

- [x] 4.1 Verify all skill guides are readable and accurate.
- [x] 4.2 Test the `/mcp` endpoint with a sample JSON-RPC tool list request (unit tests added).
- [x] 4.3 Verify `README.md` links and sections.
