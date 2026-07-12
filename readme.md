# Answerbook API

> 一個部署在 Cloudflare Workers 上的多功能 API 服務，提供解答之書、單詞學習、詩籤、市場數據等多種功能。

**線上服務**: `https://answerbook.david888.com`

---

## 📚 功能概覽

| 功能分類 | 說明 | 端點範例 |
|---------|------|---------|
| 📄 **API 文檔** | **Swagger UI (OpenAPI 3.0)** | `/` |
| 🎱 解答之書 | 隨機解答生成器（支援雙語） | `/answers`, `/answersOriginal` |
| 📖 單詞學習 | GRE/TOEFL/IELTS/GMAT/SAT 詞彙 API | `/words/*` |
| 🔐 工具類 | 隨機密碼生成器 | `/RandomPassword` |
| 📜 詩籤類 | 唐詩、日本淺草籤 | `/TangPoetry`, `/TempleOracleJP` |
| 📊 市場數據 | S&P 500、Nasdaq、台股等 | `/SP500`, `/nasdaq100` 等 |

---

## 🚀 快速開始

### 查看 API 文檔
直接訪問根目錄即可查看完整的 Swagger UI 文檔：
```bash
https://answerbook.david888.com/
```

### 常用 CURL 範例

**解答之書 (Book of Answers)**
```bash
# 預設雙語
curl https://answerbook.david888.com/answers

# 指定語言
curl "https://answerbook.david888.com/answers?lang=en"
curl "https://answerbook.david888.com/answers?lang=zh-TW"

# 原版解答
curl http://answerbook.david888.com/answersOriginal
```

**單詞學習 (Words Learning)**
```bash
# 查看分類
curl https://answerbook.david888.com/words/categories

# GRE 單詞
curl https://answerbook.david888.com/words/gre
```

**其他工具**
```bash
# 隨機密碼
curl http://answerbook.david888.com/RandomPassword

# 唐詩
curl http://answerbook.david888.com/TangPoetry

# 日本淺草籤
curl http://answerbook.david888.com/TempleOracleJP
```

**市場數據**
```bash
curl http://answerbook.david888.com/SP500
curl http://answerbook.david888.com/nasdaq100
curl http://answerbook.david888.com/TW0050
```

---

## 🤖 LLM & AI 整合 (Skills & MCP)

本專案針對 AI 助手（如 Claude, Codex, Cursor）進行了優化，提供標準化的 **Skills** 說明文件與 **MCP (Model Context Protocol)** 伺服器。

### 1. AI Skills 文件
我們在專案根目錄的 `skills/` 資料夾下提供了結構化的 Skill 說明，幫助 LLM 準確理解如何調用各類 API：
- [Answer Book Skill](skills/answer-book/SKILL.md)
- [Market Data Skill](skills/market-data/SKILL.md)
- [Words Learning Skill](skills/words-learning/SKILL.md)
- [Utilities Skill](skills/utilities/SKILL.md)

### 2. MCP Server
本服務支援 MCP 協定，透過 `/mcp` 端點提供 Tool 發現與執行功能。這使得支援 MCP 的客戶端可以自動將 API 轉換為可直接串接的工具。

**MCP 端點**: `POST https://answerbook.david888.com/mcp`

---

## 📖 API 詳細說明

雖然建議使用 [Swagger UI](https://answerbook.david888.com/)，但此處提供核心 API 的快速參考。

### 1️⃣ 解答之書 API

#### `GET /answers` (原 `GET /`)
返回隨機解答（預設雙語）。

- **參數**: `lang` (可選): `en` | `zh-TW`
- **回應範例**:
  ```json
  { "answer": "中文答案\nEnglish answer" }
  ```

#### `GET /answersOriginal`
從原版 350 條解答中返回隨機一條。

- **參數**: 同上
- **回應範例**:
  ```json
  { "answer": "單一語言答案" }
  ```

#### `GET /answersWithMeta`
返回帶有屬性 (Metadata) 的解答，支援過濾。

- **參數**: `lang`, `tone`, `mood`, `style`, `length`, `themes`
- **回應範例**:
  ```json
  {
    "id": "344",
    "answer": "Let dice decide the order",
    "answer_i18n": { "zh-TW": "用骰子決定順序", "en": "Let dice decide the order" },
    "meta": { "tone": "playful", "themes": ["decision"] }
  }
  ```

### 2️⃣ 單詞學習 API

新版詞彙 API，支援多種考試類型。

- **獲取分類**: `GET /words/categories`
- **獲取隨機詞彙**: `GET /words/{category}` (category: `gre`, `gmat`, `ielts`, `toefl`, `sat`)
- **獲取特定詞彙**: `GET /words/{category}/{word}`

### 3️⃣ 其他 API

| 端點 | 回應範例 |
|------|---------|
| `/RandomPassword` | `{ "RandomPassword": "xyz..." }` |
| `/TangPoetry` | `{ "poem": { "title": "...", "content": "..." } }` |
| `/TempleOracleJP` | `{ "oracle": { "type": "大吉", "poem": "..." } }` |
| `/SP500`等 | `{ "SP500": { "price": "..." } }` |

---

## 📦 數據管理與同步 (KV)

若修改了本地的 `data/*.json` 文件，請使用以下指令同步至 Cloudflare KV。

### 1. 解答之書數據

**同步主要解答庫**:
```bash
npx wrangler kv key put answersbook --binding ANSWERS_BOOK --path data/answersbook_i18n.json
```

**同步原版解答庫**:
```bash
npx wrangler kv key put answersbook_original --binding ANSWERS_BOOK --path data/answersbook_original_enriched.json
```

### 2. 詩籤數據

**同步日本淺草籤 (TempleOracleJP)**:
```bash
npx wrangler kv key put TempleOracleJP --binding ANSWERS_BOOK --path data/TempleOracleJP.json
```

**同步飛鳥集 (StrayBirds)**:
```bash
npx wrangler kv key put StrayBirds --binding ANSWERS_BOOK --path data/StrayBirds.json
```

### 3. 單詞數據

單詞數據量較大，請使用專用腳本處理：
```bash
# 準備並上傳單詞數據
npm run build-data
```


---

## 🏗️ 單詞學習 API 數據處理 (Advanced)

單詞學習 API 使用特殊的標籤式存儲系統來處理大量詞彙數據。

### 1. 數據目錄結構

```bash
data/
├── words/
│   ├── GRE/GRE.json
│   ├── GMAT/GMAT詞彙.json
│   ├── IELTS/雅思詞彙.json
│   ├── TOEFL/TOEFL詞彙.json
│   └── SAT/SAT詞彙.json
└── words_processed.json  # 自動生成
└── words_index.json      # 自動生成
```

### 2. 資料處理流程

若您新增或修改了 `data/words/` 下的原始 JSON 檔案，請依序執行以下步驟：

#### 步驟一：準備數據 (Prepare)
此腳本會掃描 `data/words` 目錄，解析原始文件，並生成標準化的 NDJSON 檔案與索引。

```bash
npm run prepare-words
# 或直接執行: node scripts/prepare-words-data.js
```

**輸出檔案**：
- `data/words_index.json`: 包含所有分類的元數據。
- `data/words_{category}.ndjson`: 每個分類的獨立數據檔。

#### 步驟二：上傳數據 (Upload)
此腳本會讀取生成的索引與 NDJSON 檔案，並分批上傳至 Cloudflare KV (`ANSWERS_BOOK`)。

```bash
npm run upload-words
# 或直接執行: node scripts/upload-words-to-kv.js
```

**KV 鍵值結構**:
- `words_index`: 存儲所有分類的列表。
- `words_{category}`: 存儲該分類的所有單詞 (NDJSON 格式)。

#### 快捷指令
一次完成準備與上傳：
```bash
npm run build-data
```

---

## 🛠️ 開發指南


本專案使用 **[Hono](https://hono.dev/)** 框架構建，並使用 `zod-openapi` 自動生成 Swagger 文檔。

### 環境需求
- Node.js 18+
- Cloudflare 帳號
- Wrangler CLI

### 安裝與運行
```bash
git clone https://github.com/tbdavid2019/answerbook-api.git
cd answerbook-api
npm install
npm run deploy
```

### 專案結構
```
answerbook-api/
├── src/
│   ├── index.js              # Hono App Entry Point
│   └── index.legacy.js       # Legacy Backup
├── data/                     # JSON 數據源
├── scripts/                  # 數據處理腳本
└── wrangler.toml             # Cloudflare 配置
```

---

## 📅 更新日誌

### v1.0.2 (2026-07-12)
- **✨ New**: 新增泰戈爾《飛鳥集》雙語隨機詩集 API 端點 `/StrayBirds`，支援英文原文與繁體中文。
- **🛠️ MCP**: 新增 `get_stray_birds` Model Context Protocol 工具。
- **🐛 Fix**: 修正 `readme.md` 中的 `wrangler` KV 指令為新版空格語法 `kv key put`。
- **🧪 Test**: 新增測試覆蓋率保證。

### v1.0.1 (2024-12-26)
- **🐛 Fix**: 修復 Swagger UI 載入 500 錯誤。
- **🔙 Revert**: 恢復舊版 API 的 Flat Object 回應格式，確保向下相容。
- **📝 Docs**: 恢復 README 詳細指令文檔。

### v1.0.0 (2024-12-26)
- **♻️ Refactor**: 遷移至 **Hono v4** 框架。
- **✨ New**: 引入 Swagger UI (OpenAPI 3.0)。
- **🔄 Change**: 解答之書路徑從 `/` 移至 `/answers`。

---

## 🤝 貢獻
歡迎提交 Pull Request 或開啟 Issue！