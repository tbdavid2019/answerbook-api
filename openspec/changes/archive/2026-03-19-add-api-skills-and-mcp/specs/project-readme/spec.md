## ADDED Requirements

### Requirement: LLM guidance in README
The root `README.md` should explicitly mention the availability of skill guides and the MCP server.

#### Scenario: Discovery via README
- **WHEN** a user or LLM reads the `README.md`
- **THEN** they should see a section titled "AI & LLM Integration" that points to `.agent/skills/api-guides/` and describes the `/mcp` endpoint.
