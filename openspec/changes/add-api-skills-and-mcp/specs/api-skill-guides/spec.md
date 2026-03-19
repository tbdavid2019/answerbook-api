## ADDED Requirements

### Requirement: Structured skill files for LLMs
The system should provide markdown files that guide LLMs on how to interact with the API endpoints.

#### Scenario: Categorized documentation
- **WHEN** an LLM explores the `.agent/skills/api-guides/` directory
- **THEN** it should find separate `.md` files for Answer Book, Market Data, Words Learning, and Utilities, each with detailed usage instructions.
