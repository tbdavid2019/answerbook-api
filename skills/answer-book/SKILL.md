---
name: answer-book
description: Get answers from the "Book of Answers" with various filters and languages.
license: MIT
metadata:
  author: david
  version: "1.0"
---

This skill provides access to the "Book of Answers" database.

## Input
- `lang` (optional): `en` or `zh-TW`
- `tone`, `mood`, `style`, `length` (optional): Specific metadata filters for `answersWithMeta`
- `themes` (optional): Comma-separated list of themes

## Steps
1. **Choose Endpoint**:
   - Use `GET /answers` for a simple random answer.
   - Use `GET /answersOriginal` for a random answer from the original 350 entries.
   - Use `GET /answersWithMeta` if specific filtering is required.
2. **Handle Language**:
   - Defaults to `zh-TW` if not specified.
3. **Handle Response**:
   - The response will contain the answer and potentially metadata.

## Output
A localized answer string or a JSON object with the answer and metadata.
---
