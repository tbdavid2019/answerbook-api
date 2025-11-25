## DEMO

要在現有的 `README.md` 文件上添加新的說明，並保持與現有內容一致，你可以在 `DEMO` 區塊中加入新的 GRE 單字 API 的說明。

以下是新增的內容：

---

## DEMO

- **Book of Answers API (Traditional Chinese)**  
  **解答之書API. 繁體中文**:
  ```bash
  curl http://answerbook.david888.com/
  ```

- **Book of Answers API (English)**  
  **解答之書API. 英文**:
  ```bash
  curl http://answerbook.david888.com/?lang=en
  ```

- **Book of Answers API (Original Version)**  
  **解答之書API. 書本原版**:
  ```bash
  curl http://answerbook.david888.com/answersOriginal
  ```

- **Book of Answers with Meta (filtered by tone/themes)**  
  **解答之書（含 meta，依 tone/themes 過濾）**:
  ```bash
  # 英文、語氣 playful，主題包含 play 或 creativity
  curl "http://answerbook.david888.com/answersWithMeta?lang=en&tone=playful&themes=play,creativity"
  ```

- **Random Password Generator**  
  **隨機密碼產生器**:
  ```bash
  curl http://answerbook.david888.com/RandomPassword
  ```

- **Random Tang Poetry API**  
  **隨機唐詩API**:
  ```bash
  curl http://answerbook.david888.com/TangPoetry
  ```

- **Random Temple Oracle API (Japanese)**  
  **隨機淺草籤API**:
  ```bash
  curl http://answerbook.david888.com/TempleOracleJP
  ```

- **Random GRE Words API**  
  **隨機 GRE 單字 API**:
  ```bash
  curl http://answerbook.david888.com/greWord
  ```

- **S&P 500 Data**  
  **標普 500 數據**:
  ```bash
  curl http://answerbook.david888.com/SP500
  ```

- **TW0050 Data**  
  **元大台灣 50 數據**:
  ```bash
  curl http://answerbook.david888.com/TW0050
  ```

- **TW0051 Data**  
  **元大台灣 50 正 2 數據**:
  ```bash
  curl http://answerbook.david888.com/TW0051
  ```

- **Nasdaq 100 Data**  
  **納斯達克 100 數據**:
  ```bash
  curl http://answerbook.david888.com/nasdaq100
  ```

- **Dow Jones Data**  
  **道瓊工業指數數據**:
  ```bash
  curl http://answerbook.david888.com/dowjones
  ```




# Cloudflare Worker API Project | Cloudflare Worker API 專案

This project is a Cloudflare Worker that provides an external API service for generating random answers from a pre-defined set in an `answersbook_i18n.json` file. 
It also includes an endpoint for generating secure random passwords.  
此專案是一個 Cloudflare Worker，提供外部 API 服務，用於從 `answersbook_i18n.json` 文件中的預定義集合生成隨機解答。
該專案還包含一個用於生成安全隨機密碼的端點。

## Features | 特色功能

- **Book of Answers Response API**: Returns a random answer from the `answersbook_i18n.json` file.  
  **解答之書的回答 API**：從 `answersbook_i18n.json` 文件中返回隨機解答。

- **Book of Answers API (Original Version)**: Returns a random answer from the original 350 entries (`answersbook_original_enriched.json`).  
  **解答之書API (原版)**：從原版 350 條解答 (`answersbook_original_enriched.json`) 中返回隨機解答。

- **Book of Answers with Meta API**: Returns a random answer plus its `meta` (tone/mood/style/length/themes) and supports filter-by-meta.  
  **解答之書（含 meta）API**：返回隨機答案與 `meta`，可依 meta 過濾。

- **Random Password Generator**: Generates a secure random password containing symbols, numbers, uppercase, and lowercase letters with a length of 16 characters.  
  **隨機密碼生成器**：生成一個包含符號、數字、大寫字母和小寫字母的安全隨機密碼，長度為 16 個字符。

## Dataset Stats | 解答之書資料統計

- Total answers: 500  
- Tone: direct 214、practical 84、cautious 43、reflective 31、playful 28、gentle 23、mystic 15、encouraging 14、decisive 13、calming 7、humor 6、adventurous 6、bold 5、poetic 3、respectful 2、collaborative 2、creative 2、ritual 1、strategic 1  
- Mood: neutral 301、positive 145、ambiguous 52、negative 2  
- Style: oracle 193、instructional 136、situational 54、direct 45、ritual 28、humor 14、timing 9、creativity 9、rest 5、strategic 4、planning 1、intuition 1、poetic 1  
- Length: short 240、medium 256、long 4  
- Top themes: general 146、timing 75、decision 46、relationships 45、self 45、rest 44、planning 41、intuition 40、work 40、communication 37（其餘為 health、risk、play、creativity 等長尾）

## API Endpoints | API 端點

### 1. Book of Answers Response API | 解答之書的回答 API

- **Endpoint**: `GET /`  
  **端點**: `GET /`

- **Language Switch | 切換語言**:
*** 預設繁體中文  
  - English: `GET /?lang=en`  
  - 繁體中文: `GET /?lang=zh-TW`

- **Description**: Returns a random answer from the `answersbook_i18n.json` file based on the specified language.  
  **描述**: 根據指定的語言從 `answersbook_i18n.json` 文件中返回隨機解答。

- **Response Format**:  
  **返回格式**:
  ```json
  {
    "answer": {
      "zh-TW": "隨機中文答案",
      "en": "Random English answer"
    }
  }
  ```

### 2. Book of Answers API (Original Version) | 解答之書API (原版)

- **Endpoint**: `GET /answersOriginal`  
  **端點**: `GET /answersOriginal`

- **Language Switch | 切換語言**:
*** 預設繁體中文  
  - English: `GET /answersOriginal?lang=en`  
  - 繁體中文: `GET /answersOriginal?lang=zh-TW`

- **Description**: Returns a random answer from the original 350 entries (`answersbook_original_enriched.json`).  
  **描述**: 從原版 350 條解答 (`answersbook_original_enriched.json`) 中返回隨機解答。

- **Response Format**:  
  **返回格式**:
  ```json
  {
    "answer": {
      "zh-TW": "隨機中文答案",
      "en": "Random English answer"
    }
  }
  ```

### 3. Book of Answers with Meta API | 解答之書（含 meta）API

- **Endpoint**: `GET /answersWithMeta`  
  **端點**: `GET /answersWithMeta`

- **Query**: `lang`（預設 `zh-TW`）、`tone`、`mood`、`style`、`length`、`themes`（逗號分隔）。所有 meta 字段皆為選填。  
  例：`/answersWithMeta?lang=en&tone=playful&themes=play,creativity`

- **Description**: Returns one random answer with both languages and its meta; filters by meta when provided.  
  **描述**: 返回帶中英答案與 meta 的隨機條目；若提供 meta 條件則先過濾。

- **Response Format**:  
  **返回格式**:
  ```json
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
  ```

### 4. Random Password Generator API | 隨機密碼生成器 API

- **Endpoint**: `GET /RandomPassword`  
  **端點**: `GET /RandomPassword`

- **Description**: Returns a randomly generated password.  
  **描述**: 返回一個隨機生成的密碼。

- **Response Format**:  
  **返回格式**:
  ```json
  {
    "RandomPassword": "4Ei1-SwJN-zKtK-ZYug"
  }
  ```

## Installation | 安裝

1. **Clone the repository | 克隆儲存庫**:
   ```bash
   git clone https://github.com/tbdavid2019/answerbook-api.git
   cd your-repo
   ```

2. **Install Cloudflare Wrangler | 安裝 Cloudflare Wrangler**:
   Follow the [Wrangler installation guide](https://developers.cloudflare.com/workers/wrangler/get-started#install) to set up Wrangler.  
   按照 [Wrangler 安裝指南](https://developers.cloudflare.com/workers/wrangler/get-started#install) 設置 Wrangler。

3. **Configure Wrangler | 配置 Wrangler**:
   Update your `wrangler.toml` file with your Cloudflare account details.  
   使用你的 Cloudflare 帳戶詳細信息更新 `wrangler.toml` 文件。

4. **Deploy the Worker | 部署 Worker**:
   Deploy the worker to Cloudflare using Wrangler:  
   使用 Wrangler 部署 Worker：
   ```bash
   wrangler publish
   ```

5. **Sync KV with latest answers (500 entries, with meta) | 同步最新答案（500 筆含 meta）到 KV**  
   ```bash
   npx wrangler kv:key put --binding=ANSWERS_BOOK answersbook --path=data/answersbook_i18n.json
   ```
   - 若使用其他 namespace/binding，請改用對應的 `--binding` 或 `--namespace-id`。

## Usage | 使用方法

After deployment, the API endpoints will be available at the worker's domain, e.g., `https://your-worker.subdomain.workers.dev`.  
部署後，API 端點將可在 Worker 的域名下訪問，例如 `https://your-worker.subdomain.workers.dev`。

## Contributing | 貢獻

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue to discuss any improvements or features.  
歡迎貢獻！請隨時提交 Pull Request 或開啟 Issue 來討論任何改進或新功能。



## Contact | 聯絡方式

For any questions or feedback, you can reach out me [).  
如有任何問題或反饋，您可以通過 issue 與我聯絡
