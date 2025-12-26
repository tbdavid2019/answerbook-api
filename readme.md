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

### 解答之書範例 (新路徑)

```bash
# 雙語結果（預設）
curl https://answerbook.david888.com/answers

# 僅英文
curl "https://answerbook.david888.com/answers?lang=en"

# 僅繁體中文
curl "https://answerbook.david888.com/answers?lang=zh-TW"
```

### 單詞學習 API 範例

```bash
# 查看所有分類
curl https://answerbook.david888.com/words/categories

# 獲取 GRE 隨機單詞
curl https://answerbook.david888.com/words/gre
```

---

## 📖 API 文檔

> 💡 **提示**: 建議直接查看 [Swagger UI](https://answerbook.david888.com/) 獲取最新、最強大的互動式文檔。

### 1️⃣ 解答之書 API

#### `GET /answers` (原 `/`)
返回隨機解答（雙語或單語）

**參數**: `lang` (可選): `en` | `zh-TW`

#### `GET /answersOriginal`
返回原版 350 條解答中的隨機一條

#### `GET /answersWithMeta`
返回帶有 metadata 的解答，支援過濾

---

### 2️⃣ 單詞學習 API

#### `GET /words/categories`
獲取所有可用的詞彙分類

#### `GET /words/{category}`
從指定分類獲取隨機單詞 (`gre`, `gmat`, `ielts`, `toefl`, `sat`)

#### `GET /words/{category}/{word}`
獲取特定單詞的詳細資訊

---

### 3️⃣ 其他 API

| 端點 | 說明 |
|------|------|
| `GET /RandomPassword` | 生成 16 字元隨機密碼 |
| `GET /TangPoetry` | 隨機唐詩 |
| `GET /TempleOracleJP` | 隨機日本淺草籤 |
| `GET /SP500` | S&P 500 數據 |
| `GET /nasdaq100` | Nasdaq 100 數據 |
| `GET /TW0050` | 元大台灣 50 數據 |

---

## 🛠️ 開發指南

本專案使用 **[Hono](https://hono.dev/)** 框架構建，並使用 `zod-openapi` 自動生成 Swagger 文檔。

### 環境需求

- Node.js 18+
- Cloudflare 帳號
- Wrangler CLI

### 安裝與設定

```bash
# 1. 克隆專案
git clone https://github.com/tbdavid2019/answerbook-api.git
cd answerbook-api

# 2. 安裝依賴
npm install

# 3. 本地開發
npm run dev
# 服務運行在 http://localhost:8787
```

### 專案結構

```
answerbook-api/
├── src/
│   ├── index.js              # Hono App Entry Point (New)
│   └── index.legacy.js       # Legacy Request Handler (Backup)
├── scripts/
│   └── ...                   # 數據處理腳本
└── wrangler.toml             # Cloudflare 配置
```

---

## 📅 更新日誌

### v1.0.1 (2024-12-26)
- **🐛 Fix**: 修復 Swagger UI 載入時的 500 錯誤。
  - 原因：`zod-to-openapi` 與新版 `zod` 對 dynamic types (`z.record`) 的處理不相容。
  - 解決：將 schema 定義更新為 `z.object({}).passthrough()`。

### v1.0.0 (2024-12-26)
- **♻️ Refactor**: 將底層框架從原生 Worker 遷移至 **Hono v4**。
- **✨ New**: 引入 Swagger UI (OpenAPI 3.0) 自動化文檔，位於根路徑 `/`。
- **🔄 Change**: 原解答之書 API 從 `/` 移動至 `/answers`。
- **🔒 Security**: 實作標準化 CORS Middleware。

---

## 🤝 貢獻

歡迎提交 Pull Request 或開啟 Issue！