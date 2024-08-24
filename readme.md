
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

- **Random Password Generator**  
  **隨機密碼產生器**:
    ```bash
  curl http://answerbook.david888.com/RandomPassword
  ```



# Cloudflare Worker API Project | Cloudflare Worker API 專案

This project is a Cloudflare Worker that provides an external API service for generating random answers from a pre-defined set in an `answersbook_i18n.json` file. 
It also includes an endpoint for generating secure random passwords.  
此專案是一個 Cloudflare Worker，提供外部 API 服務，用於從 `answersbook_i18n.json` 文件中的預定義集合生成隨機解答。
該專案還包含一個用於生成安全隨機密碼的端點。

## Features | 特色功能

- **Book of Answers Response API**: Returns a random answer from the `answersbook_i18n.json` file.  
  **解答之書的回答 API**：從 `answersbook_i18n.json` 文件中返回隨機解答。

- **Random Password Generator**: Generates a secure random password containing symbols, numbers, uppercase, and lowercase letters with a length of 16 characters.  
  **隨機密碼生成器**：生成一個包含符號、數字、大寫字母和小寫字母的安全隨機密碼，長度為 16 個字符。

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

### 2. Random Password Generator API | 隨機密碼生成器 API

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

## Usage | 使用方法

After deployment, the API endpoints will be available at the worker's domain, e.g., `https://your-worker.subdomain.workers.dev`.  
部署後，API 端點將可在 Worker 的域名下訪問，例如 `https://your-worker.subdomain.workers.dev`。

## Contributing | 貢獻

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue to discuss any improvements or features.  
歡迎貢獻！請隨時提交 Pull Request 或開啟 Issue 來討論任何改進或新功能。

## License | 授權

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for more details.  
本專案依據 MIT 許可證授權。詳細信息請參閱 [LICENSE](./LICENSE) 文件。

## Contact | 聯絡方式


For any questions or feedback, you can reach out me [).  
如有任何問題或反饋，您可以通過 issue 與我聯絡


