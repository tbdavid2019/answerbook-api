---
name: market-data
description: Access stock market index data for S&P 500, Nasdaq, Dow Jones, and TW0050/51.
license: MIT
metadata:
  author: david
  version: "1.0"
---

This skill provides the latest market data for major indices.

## Input
- Select one of the supported indices: `SP500`, `nasdaq100`, `dowjones`, `TW0050`, `TW0051`.

## Steps
1. **Call Endpoint**:
   - `GET /SP500`
   - `GET /nasdaq100`
   - `GET /dowjones`
   - `GET /TW0050`
   - `GET /TW0051`
2. **Parse Result**:
   - The response is a JSON object containing the index data.

## Output
JSON object with the requested market data.
---
