# Cloudflare Worker API Project | Cloudflare Worker API 專案

This project is a Cloudflare Worker that provides an external API service for generating random answers from a pre-defined set.  
此專案是一個 Cloudflare Worker，提供外部 API 服務，用於生成隨機解答。
It also includes endpoints for random passwords, poetry/oracle, market data, and a comprehensive Words Learning API.  
同時提供隨機密碼、詩籤、行情資料，以及完整的單詞學習 API。

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
---

### 🆕 New Words API | 新單詞 API

- **Get All Categories | 獲取所有分類**:
  ```bash
  curl http://answerbook.david888.com/words/categories
  ```

- **Get Random Word from GRE | 獲取 GRE 隨機單詞**:
  ```bash
  curl http://answerbook.david888.com/words/gre
  ```

- **Get Random Word from TOEFL | 獲取 TOEFL 隨機單詞**:
  ```bash
  curl http://answerbook.david888.com/words/toefl
  ```

- **Get Specific Word | 獲取特定單詞詳情**:
  ```bash
  curl http://answerbook.david888.com/words/gre/aberrant
  ```

- **Get Random Word from Multiple Categories | 從多個分類獲取隨機單詞**:
  ```bash
  curl http://answerbook.david888.com/words/random?categories=gre,toefl
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

- **🆕 Words Learning API**: Comprehensive vocabulary API supporting multiple test categories (GRE, GMAT, IELTS, TOEFL, SAT) with rich learning features including pronunciation, definitions, examples, synonyms, antonyms, memory tips, and phrases.  
  **🆕 單詞學習 API**：全面的詞彙 API，支持多種考試類別（GRE、GMAT、IELTS、TOEFL、SAT），提供豐富的學習功能，包括發音、定義、例句、同義詞、反義詞、記憶技巧和短語。

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
    "success": true,
    "data": {
      "answer": "中文答案\nEnglish answer"
    }
  }
  \`\`\`

- **Response Format (with lang parameter)**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "answer": "單一語言答案"
    }
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
    "success": true,
    "data": {
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
  }
  \`\`\`

### 4. Random Password Generator API | 隨機密碼生成器 API

- **Endpoint**: \`GET /RandomPassword\`

- **Response Format**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "RandomPassword": "4Ei1-SwJN-zKtK-ZYug"
    }
  }
  ```

### 3. 🆕 Words Learning API | 單詞學習 API

#### 3.1 Get All Categories | 獲取所有分類

- **Endpoint**: `GET /words/categories`
- **Description**: Returns a list of all available vocabulary categories.  
  **描述**: 返回所有可用的詞彙分類列表。

- **Response Format**:
  ```json
  {
    "success": true,
    "data": {
      "categories": [
        {
          "id": "gre",
          "name": "GRE",
          "fullName": "Graduate Record Examination",
          "totalWords": 7200
        },
        {
          "id": "toefl",
          "name": "TOEFL",
          "fullName": "Test of English as a Foreign Language",
          "totalWords": 9214
        }
      ],
      "total": 5
    }
  }
  ```

#### 3.2 Get Random Word by Category | 按分類獲取隨機單詞

- **Endpoint**: `GET /words/{category}`
- **Parameters**: 
  - `category`: gre, gmat, ielts, toefl, sat
- **Description**: Returns a random word from the specified category.  
  **描述**: 從指定分類中返回隨機單詞。

- **Example**: `GET /words/gre`
- **Response Format**:
  ```json
  {
    "success": true,
    "data": {
      "word": "aberrant",
      "category": "gre",
      "wordRank": 2,
      "pronunciation": {
        "ipa": "'ɛbərənt",
        "us": "ˈæbərənt",
        "uk": "əˈberənt",
        "audioUS": "url",
        "audioUK": "url"
      },
      "definitions": [
        {
          "partOfSpeech": "adj",
          "chinese": "異常的；偏離的",
          "english": "markedly different from an accepted norm"
        }
      ],
      "examples": [
        {
          "sentence": "His aberrant behavior...",
          "translation": "他的異常行為..."
        }
      ],
      "synonyms": ["abnormal", "deviant", "anomalous"],
      "antonyms": ["normal", "typical"],
      "relatedWords": [
        {
          "word": "aberration",
          "relation": "noun form",
          "meaning": "偏差；異常"
        }
      ],
      "memoryTip": "記憶方法或詞根解析",
      "phrases": [
        {
          "phrase": "aberrant behavior",
          "meaning": "異常行為"
        }
      ]
    }
  }
  ```

#### 3.3 Get Specific Word | 獲取特定單詞

- **Endpoint**: `GET /words/{category}/{word}`
- **Description**: Returns detailed information about a specific word.  
  **描述**: 返回特定單詞的詳細信息。

- **Example**: `GET /words/gre/aberrant`
- **Response Format**: Same as 3.2

#### 3.4 Get Random Word from Any/Multiple Categories | 從任意/多個分類獲取隨機單詞

- **Endpoint**: `GET /words/random`
- **Query Parameters** (optional):
  - `categories`: Comma-separated list of categories (e.g., `gre,toefl`)
- **Description**: Returns a random word from all categories or specified categories.  
  **描述**: 從所有分類或指定分類中返回隨機單詞。

- **Examples**:
  - All categories: `GET /words/random`
  - Specific categories: `GET /words/random?categories=gre,toefl,ielts`

- **Response Format**: Same as 3.2

### Response Status Codes | 響應狀態碼

- `200 OK`: Successful request | 請求成功
- `400 Bad Request`: Invalid parameters | 無效參數
- `404 Not Found`: Resource not found | 資源未找到
- `500 Internal Server Error`: Server error | 服務器錯誤

### Error Response Format | 錯誤響應格式

```json
{
  "success": false,
  "error": "Error message description"
}
```

## Installation | 安裝

1. **Clone the repository | 克隆儲存庫**:
   \`\`\`bash
   git clone https://github.com/tbdavid2019/answerbook-api.git
   cd answerbook-api
   \`\`\`

2. **Install Dependencies | 安裝依賴**:
   \`\`\`bash
   npm install
   \`\`\`

3. **Install Cloudflare Wrangler | 安裝 Cloudflare Wrangler**:
   Follow the [Wrangler installation guide](https://developers.cloudflare.com/workers/wrangler/get-started#install) to set up Wrangler.  
   按照 [Wrangler 安裝指南](https://developers.cloudflare.com/workers/wrangler/get-started#install) 設置 Wrangler。

4. **Configure Wrangler | 配置 Wrangler**:
   Update your `wrangler.toml` file with your Cloudflare account details.  
   使用你的 Cloudflare 帳戶詳細信息更新 `wrangler.toml` 文件。

5. **Sync KV data | 同步 KV 資料**:
   \`\`\`bash
   npx wrangler kv key put answersbook --path=data/answersbook_i18n.json --namespace-id YOUR_NAMESPACE_ID
   npx wrangler kv key put answersbook_original --path=data/answersbook_original_enriched.json --namespace-id YOUR_NAMESPACE_ID
   \`\`\`

6. **🆕 Prepare Words Data | 準備單詞數據**:
   \`\`\`bash
   # 處理並整合所有詞彙文件
   node scripts/prepare-words-data.js
   
   # 上傳處理後的數據到 Cloudflare KV
   node scripts/upload-words-to-kv.js
   \`\`\`

7. **Deploy the Worker | 部署 Worker**:
   ```bash
   npx wrangler deploy
   ```

## Development | 開發

### Run Tests | 運行測試

```bash
npm test
```

### Local Development | 本地開發

```bash
npm run dev
```

This will start a local development server at `http://localhost:8787`  
這將啟動本地開發服務器，地址為 `http://localhost:8787`

### Data Processing Pipeline | 數據處理流程

1. **Prepare Words Data | 準備詞彙數據**:
   - Script reads all vocabulary JSON files from `data/words/` directory
   - Parses and standardizes the data format
   - Generates lightweight index file: `data/words_index.json`
   - Generates category-specific NDJSON files: `data/words_{category}.ndjson`
   
   腳本從 `data/words/` 目錄讀取所有詞彙 JSON 文件，解析並標準化數據格式，生成輕量級索引文件 `data/words_index.json`，為每個分類生成獨立的 NDJSON 文件 `data/words_{category}.ndjson`

2. **Upload to KV | 上傳到 KV**:
   - Uses Wrangler CLI to upload processed data to Cloudflare KV in batches
   - Index file stored under key: `words_index`
   - Category files stored under keys: `words_gre`, `words_gmat`, `words_ielts`, `words_toefl`, `words_sat`
   - Each file is uploaded separately to avoid size limits (KV limit: 25MB per value)
   
   使用 Wrangler CLI 分批上傳處理後的數據到 Cloudflare KV，索引文件存儲為 `words_index`，各分類文件分別存儲為 `words_gre`、`words_gmat`、`words_ielts`、`words_toefl`、`words_sat`，每個文件獨立上傳以避免大小限制（KV 限制：每個值 25MB）

### Project Structure | 專案結構

```
answerbook-api/
├── src/
│   └── index.js           # Main Worker code | 主要 Worker 代碼
├── test/
│   └── index.spec.js      # Test cases | 測試用例
├── scripts/
│   ├── prepare-words-data.js    # Data processing script | 數據處理腳本
│   └── upload-words-to-kv.js    # KV upload script | KV 上傳腳本
├── data/
│   ├── words/             # Raw vocabulary files | 原始詞彙文件
│   │   ├── GRE/
│   │   ├── GMAT/
│   │   ├── IELTS/
│   │   ├── TOEFL/
│   │   └── SAT/
│   ├── words_index.json       # Index file with metadata | 索引文件（元數據）
│   ├── words_gre.ndjson       # GRE words (NDJSON format) | GRE 詞彙（NDJSON 格式）
│   ├── words_gmat.ndjson      # GMAT words | GMAT 詞彙
│   ├── words_ielts.ndjson     # IELTS words | IELTS 詞彙
│   ├── words_toefl.ndjson     # TOEFL words | TOEFL 詞彙
│   └── words_sat.ndjson       # SAT words | SAT 詞彙
├── wrangler.toml          # Wrangler configuration | Wrangler 配置
├── package.json
└── README.md
```

## Adding New Word Sources | 新增字源

To add a new vocabulary category (e.g., TOEIC, GEPT), follow these steps:  
要新增新的詞彙分類（例如 TOEIC、GEPT），請按照以下步驟：

### Step 1: Prepare Source Data | 步驟 1：準備原始數據

1. Create a new folder under `data/words/` for your category:  
   在 `data/words/` 下創建新的分類資料夾：
   ```bash
   mkdir -p data/words/TOEIC
   ```

2. Add your vocabulary JSON file(s) to the folder:  
   將詞彙 JSON 文件放入資料夾：
   ```bash
   data/words/TOEIC/TOEIC詞彙.json
   ```

3. Ensure your JSON file follows the expected format (array of word objects).  
   確保 JSON 文件格式正確（單詞對象陣列）。

### Step 2: Update Processing Script | 步驟 2：更新處理腳本

Edit `scripts/prepare-words-data.js` to include your new category:  
編輯 `scripts/prepare-words-data.js` 以包含新分類：

```javascript
// 詞彙分類配置 (Line 16-22)
const CATEGORIES = {
  gre: { path: 'GRE/GRE.json', name: 'GRE', fullName: 'Graduate Record Examination' },
  gmat: { path: 'GMAT/GMAT詞彙.json', name: 'GMAT', fullName: 'Graduate Management Admission Test' },
  ielts: { path: 'IELTS/雅思詞彙.json', name: 'IELTS', fullName: 'International English Language Testing System' },
  toefl: { path: 'TOEFL/TOEFL詞彙.json', name: 'TOEFL', fullName: 'Test of English as a Foreign Language' },
  sat: { path: 'SAT/SAT詞彙.json', name: 'SAT', fullName: 'Scholastic Assessment Test' },
  // 新增你的分類
  toeic: { path: 'TOEIC/TOEIC詞彙.json', name: 'TOEIC', fullName: 'Test of English for International Communication' }
};
```

**Configuration fields | 配置欄位說明**:
- `path`: Relative path to JSON file from `data/words/` | 從 `data/words/` 開始的相對路徑
- `name`: Short display name | 簡短顯示名稱
- `fullName`: Full descriptive name | 完整描述名稱

### Step 3: Process and Upload | 步驟 3：處理並上傳

1. **Run the data processing script**:  
   **執行數據處理腳本**：
   ```bash
   npm run prepare-words
   ```
   This will generate:  
   這將生成：
   - Updated `data/words_index.json`
   - New `data/words_toeic.ndjson`

2. **Upload to Cloudflare KV**:  
   **上傳到 Cloudflare KV**：
   ```bash
   npm run upload-words
   ```
   This will upload all category files including the new one.  
   這將上傳所有分類文件，包括新的分類。

3. **Deploy the updated Worker**:  
   **部署更新後的 Worker**：
   ```bash
   npm run deploy
   ```

### Step 4: Test Your New Category | 步驟 4：測試新分類

```bash
# Check if category appears in the list
curl https://your-worker.workers.dev/words/categories

# Get a random word from the new category
curl https://your-worker.workers.dev/words/toeic

# Get a specific word
curl https://your-worker.workers.dev/words/toeic/example
```

### Notes | 注意事項

- Each category file should be under 25MB (Cloudflare KV limit)  
  每個分類文件應小於 25MB（Cloudflare KV 限制）
- NDJSON format (one JSON object per line) is used for efficient storage  
  使用 NDJSON 格式（每行一個 JSON 對象）以實現高效存儲
- The API automatically supports new categories once uploaded to KV  
  上傳到 KV 後，API 會自動支持新分類
- No code changes needed in `src/index.js` unless you need custom logic  
  除非需要自定義邏輯，否則無需修改 `src/index.js`

### Quick Reference | 快速參考

```
新增字源流程圖 Flow Chart
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. 準備數據 Prepare Data
   └─> data/words/TOEIC/TOEIC詞彙.json

2. 更新配置 Update Config
   └─> scripts/prepare-words-data.js
       └─> CATEGORIES = { ..., toeic: {...} }

3. 處理數據 Process Data
   └─> npm run prepare-words
       ├─> 生成 data/words_index.json (更新)
       └─> 生成 data/words_toeic.ndjson (新增)

4. 上傳到 KV Upload to KV
   └─> npm run upload-words
       ├─> words_index (更新)
       └─> words_toeic (新增)

5. 部署 Deploy
   └─> npm run deploy

6. 測試 Test
   └─> curl .../words/categories
   └─> curl .../words/toeic
```

---

## Usage | 使用方法

After deployment, the API endpoints will be available at \`https://answerbook.david888.com/\`.  
部署後，API 端點將可在 \`https://answerbook.david888.com/\` 訪問。

## Contributing | 貢獻

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue.  
歡迎貢獻！請隨時提交 Pull Request 或開啟 Issue。

## Contact | 聯絡方式

For any questions or feedback, please open an issue.  
如有任何問題或反饋，請開啟 issue。
