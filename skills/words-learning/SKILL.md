---
name: words-learning
description: Vocabulary learning skill for GRE, TOEFL, IELTS, and other categories.
license: MIT
metadata:
  author: david
  version: "1.0"
---

This skill helps with English vocabulary learning across multiple standardized test categories.

## Input
- `category` (optional): The category ID (e.g., `gre`, `toefl`, `ielts`, `gmat`, `sat`).
- `word` (optional): A specific word to look up within a category.
- `categories` (optional): A comma-separated list of categories for random word selection.

## Steps
1. **Discovery**: Call `GET /words/categories` to see available categories and word counts.
2. **Random Selection**:
   - Call `GET /words/random` for a word from any/specified categories.
   - Call `GET /words/{category}` for a word from a specific category.
3. **Lookup**: Call `GET /words/{category}/{word}` for details on a specific word.
4. **Legacy Support**: Use `GET /greWord` for the original GRE database.

## Output
JSON object containing word definitions, pronunciations, examples, and memory tips.
---
