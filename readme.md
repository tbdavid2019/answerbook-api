# Cloudflare Worker API Project | Cloudflare Worker API 專案

This project is a Cloudflare Worker that provides an external API service for generating random answers from a pre-defined set.  
此專案是一個 Cloudflare Worker，提供外部 API 服務，用於生成隨機解答。

## DEMO

- **Book of Answers API (Bilingual / 雙語)**:
  ```bash
  curl http://answerbook.david888.com/
  ```

- **Book of Answers API (Traditional Chinese / 繁體中文)**:
  ```bash
  curl "http://answerbook.david888.com/?lang=zh-TW"
  ```

- **Book of Answers API (English / 英文)**:
  ```bash
  curl "http://answerbook.david888.com/?lang=en"
  ```

- **Book of Answers API (Original Version / 書本原版)**:
  ```bash
  curl http://answerbook.david888.com/answersOriginal
  ```

- **Book of Answers with Meta (filtered by tone/themes)**:
  ```bash
  curl "http://answerbook.david888.com/answersWithMeta?lang=en&tone=playful&themes=play,creativity"
  ```

- **Random Password Generator / 隨機密碼產生器**:
  ```bash
  curl http://answerbook.david888.com/RandomPassword
  ```

- **Random Tang Poetry API / 隨機唐詩API**:
  ```bash
  curl http://answerbook.david888.com/TangPoetry
  ```

- **Random Temple Oracle API (Japanese) / 隨機淺草籤API**:
  ```bash
  curl http://answerbook.david888.com/TempleOracleJP
  ```

- **Random GRE Words API / 隨機 GRE 單字 API**:
  ```bash
  curl http://answerbook.david888.com/greWord
  ```

- **S&P 500 Data / 標普 500 數據**:
  ```bash
  curl http://answerbook.david888.com/SP500
  ```

- **TW0050 Data / 元大台灣 50 數據**:
  ```bash
  curl http://answerbook.david888.com/TW0050
  ```

- **TW0051 Data / 元大台灣 50 正 2 數據**:
  ```bash
  curl http://answerbook.david888.com/TW0051
  ```

- **Nasdaq 100 Data / 納斯達克 100 數據**:
  ```bash
  curl http://answerbook.david888.com/nasdaq100
  ```

- **Dow Jones Data / 道瓊工業指數數據**:
  ```bash
  curl http://answerbook.david888.com/dowjones
  ```

## Features | 特色功能

- **Book of Answers Response API**: Returns a random answer (bilingual by default, or single language with \`?lang=\` parameter).  
  **解答之書的回答 API**：返回隨機解答（預設雙語，可用 \`?lang=\` 參數指定單一語言）。

- **Book of Answers API (Original Version)**: Returns a random answer from the original 350 entries.  
  **解答之書API (原版)**：從原版 350 條解答中返回隨機解答。

- **Book of Answers with Meta API**: Returns a random answer with metadata, supports filtering.  
  **解答之書（含 meta）API**：返回隨機答案與 meta，可依 meta 過濾。

- **Random Password Generator**: Generates a secure random password (16 characters).  
  **隨機密碼生成器**：生成安全隨機密碼（16 個字符）。

## API Endpoints | API 端點

### 1. Book of Answers Response API | 解答之書的回答 API

- **Endpoint**: \`GET /\`

- **Parameters**:
  - 無參數：返回雙語結果 (zh-TW + en)
  - \`?lang=en\`：僅返回英文
  - \`?lang=zh-TW\`：僅返回繁體中文

- **Response Format (default bilingual)**:
  \`\`\`json
  {
    "answer": "中文答案\nEnglish answer"
  }
  \`\`\`

- **Response Format (with lang parameter)**:
  \`\`\`json
  {
    "answer": "單一語言答案"
  }
  \`\`\`

### 2. Book of Answers API (Original Version) | 解答之書API (原版)

- **Endpoint**: \`GET /answersOriginal\`

- **Parameters**: Same as above (無參數返回雙語，\`?lang=\` 返回單一語言)

- **Description**: Returns a random answer from the original 350 entries.  
  **描述**: 從原版 350 條解答中返回隨機解答。

### 3. Book of Answers with Meta API | 解答之書（含 meta）API

- **Endpoint**: \`GET /answersWithMeta\`

- **Query Parameters**: \`lang\`, \`tone\`, \`mood\`, \`style\`, \`length\`, \`themes\`（逗號分隔）

- **Response Format**:
  \`\`\`json
  {
    "id": "344",
    "answer": "Let dice decide the order",
    "answer_i18n": {
      "zh-TW": "用骰子決定順序",
      "en": "Let dice decide the order"
    },
    "meta": {
      "tone": "playful",
      "mood": "neutral",
      "style": "humor",
      "length": "short",
      "themes": ["decision", "play", "timing"]
    }
  }
  \`\`\`

### 4. Random Password Generator API | 隨機密碼生成器 API

- **Endpoint**: \`GET /RandomPassword\`

- **Response Format**:
  \`\`\`json
  {
    "RandomPassword": "4Ei1-SwJN-zKtK-ZYug"
  }
  \`\`\`

## Installation | 安裝

1. **Clone the repository | 克隆儲存庫**:
   \`\`\`bash
   git clone https://github.com/tbdavid2019/answerbook-api.git
   cd answerbook-api
   \`\`\`

2. **Install dependencies | 安裝依賴**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Deploy the Worker | 部署 Worker**:
   \`\`\`bash
   npm run deploy
   \`\`\`

4. **Sync KV data | 同步 KV 資料**:
   \`\`\`bash
   npx wrangler kv key put answersbook --path=data/answersbook_i18n.json --namespace-id YOUR_NAMESPACE_ID
   npx wrangler kv key put answersbook_original --path=data/answersbook_original_enriched.json --namespace-id YOUR_NAMESPACE_ID
   \`\`\`

## Usage | 使用方法

After deployment, the API endpoints will be available at \`https://answerbook.david888.com/\`.  
部署後，API 端點將可在 \`https://answerbook.david888.com/\` 訪問。

## Contributing | 貢獻

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue.  
歡迎貢獻！請隨時提交 Pull Request 或開啟 Issue。

## Contact | 聯絡方式

For any questions or feedback, please open an issue.  
如有任何問題或反饋，請開啟 issue。
