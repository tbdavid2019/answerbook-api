---
name: utilities
description: Utility functions including random password generation, Tang poetry, and Japanese temple oracles.
license: MIT
metadata:
  author: david
  version: "1.0"
---

This skill provides various useful utility functions.

## Input
- Select a utility: `RandomPassword`, `TangPoetry`, `TempleOracleJP`, `StrayBirds`.

## Steps
1. **Generate Password**: Call `GET /RandomPassword` for a 16-character secure password.
2. **Get Poetry**: Call `GET /TangPoetry` for a random Tang dynasty poem.
3. **Get Oracle**: Call `GET /TempleOracleJP` for a random Japanese temple oracle.
4. **Get Tagore Poetry**: Call `GET /StrayBirds` for a random poem from Rabindranath Tagore's Stray Birds.

## Output
Randomly generated content (password string or poem/oracle JSON).
---
