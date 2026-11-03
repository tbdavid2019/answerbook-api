# Changelog (更新日誌)

All notable changes to this project will be documented in this file.

## [v1.0.4] - 2026-11-03

### Security (安全性更新)
- **🛡️ 依賴安全漏洞修復與升級 (Dependabot & npm audit)**:
  - 將已棄用的 `@cloudflare/vitest-pool-workers` 遷移升級至官方最新 `@cloudflare/vitest-plugin` (^1.5.0)。
  - 升級 `vitest` 至 `^4.1.12`，更新測試配置至 `vitest.config.mjs`。
  - 升級 `wrangler` 至 `^4.156.2`。
  - 升級 `hono` 至 `^4.13.16`（修復 XSS、SSG 任意寫入、原型污染等漏洞）。
  - 升級 `zod` 至 `^4.6.7`（修復記憶體耗盡 DoS 漏洞 GHSA-mrhx-c7xc-m3w5）。
  - 升級 `@hono/swagger-ui` 至 `^0.6.2`、`@hono/zod-openapi` 至 `^1.6.3`。
  - 徹底解決包含 `undici`, `sharp`, `tinypool`, `node-forge`, `devalue`, `vite`, `esbuild`, `rollup`, `ws`, `yaml`, `cookie` 等所有 Dependabot 歷史警報（`npm audit` 漏洞降至 0）。

## [v1.0.3] - 2026-10-31

### Added (新增)
- **✨ 全球與台灣全市場指數路由擴充**:
  - 新增日股（`/NIKKEI225`, `/N225`, `/JP225`）、台股全市場（`/TW_ALL`, `/TAIEX`, `/TWSE`, `/TPEX`, `/OTC`）、核心 ETF（`/0050`, `/0100`, `/0056`, `/00878`, `/00919`, `/00929`, `/00940`, `/00713`, `/00850`, `/TPEX50`）、費城半導體（`/SOX`, `/PHLX`）、港股（`/HSI`, `/HSTECH`）與歐股（`/DAX40`, `/FTSE100`, `/EUROSTOXX50`）等靜態與 OpenAPI 路由註冊。
  - 新增 `GET /:key` 通用 KV 動態回退路由（Generic KV Fallback），未來任何寫入 `ANSWERS_BOOK` KV 的數據鍵值均可直接被外部或下游即時讀取，免去重啟部署需求。

### Security
- 遵循零洩漏鐵律，無任何硬編碼 API Key 或憑證。

## [v1.0.2] - 2026-07-12

### Added (新增)
- **✨ New**: 新增泰戈爾《飛鳥集》雙語隨機詩集 API 端點 `/StrayBirds`，支援英文原文與繁體中文翻譯。
- **🛠️ MCP**: 新增對應的 `get_stray_birds` Model Context Protocol (MCP) 工具，利於 AI 助手調用。
- **🧪 Test**: 新增 `/StrayBirds` 路由及 MCP 端的單元測試，確保 Hono 路由與 Mock KV 邏輯正確。

### Changed & Fixed (修改與修復)
- **📝 Docs**: 更新 `readme.md` 說明文件，加入了飛鳥集數據同步指南。
- **📝 Docs**: 更新 `skills/utilities/SKILL.md`，登錄新工具。
- **🐛 Fix**: 修正 `readme.md` 中 legacy 的 `wrangler kv:key put` 指令，替換為符合新版 Wrangler v3/v4 規範的 `wrangler kv key put` 空格語法。
