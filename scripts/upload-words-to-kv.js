#!/usr/bin/env node

/**
 * 上傳詞彙數據到 Cloudflare KV - 分批上傳模式
 * 將每個分類的數據分別上傳，避免單個文件過大的問題
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../data');
const INDEX_FILE = path.join(DATA_DIR, 'words_index.json');
const NAMESPACE_BINDING = 'ANSWERS_BOOK';

/**
 * 上傳單個文件到 KV
 */
function uploadFile(key, filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`檔案不存在: ${filePath}`);
  }

  const fileSize = fs.statSync(filePath).size;
  const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);
  
  console.log(`  Key: ${key}`);
  console.log(`  File: ${path.basename(filePath)}`);
  console.log(`  Size: ${fileSizeMB} MB`);

  try {
    // 使用 wrangler kv key put 命令（新版本語法）
    const command = `wrangler kv key put "${key}" --path="${filePath}" --binding=${NAMESPACE_BINDING}`;
    execSync(command, { stdio: 'pipe' });
    console.log(`  ✓ 上傳成功\n`);
    return true;
  } catch (error) {
    console.error(`  ✗ 上傳失敗: ${error.message}\n`);
    return false;
  }
}

/**
 * 主函數
 */
function main() {
  console.log('='.repeat(70));
  console.log('Cloudflare KV 上傳腳本 - 分批上傳模式');
  console.log('='.repeat(70));
  console.log('');

  // 檢查 Wrangler 是否已安裝
  try {
    const version = execSync('wrangler --version', { encoding: 'utf8' }).trim();
    console.log(`✓ 找到 Wrangler: ${version}\n`);
  } catch (error) {
    console.error('❌ 錯誤: 找不到 wrangler 命令');
    console.error('請先安裝 Cloudflare Wrangler:');
    console.error('  npm install wrangler --save-dev');
    console.error('然後使用:');
    console.error('  npx wrangler login');
    process.exit(1);
  }

  // 檢查索引檔案是否存在
  if (!fs.existsSync(INDEX_FILE)) {
    console.error('❌ 錯誤: 找不到索引檔案');
    console.error('請先執行: npm run prepare-words');
    process.exit(1);
  }

  // 讀取索引檔案
  const indexData = JSON.parse(fs.readFileSync(INDEX_FILE, 'utf8'));
  console.log(`找到 ${indexData.categories.length} 個分類:`);
  indexData.categories.forEach(cat => {
    console.log(`  - ${cat.name}: ${cat.totalWords} 個單詞`);
  });
  console.log('');

  let successCount = 0;
  let failCount = 0;
  const failedItems = [];

  // 步驟 1: 上傳索引檔案
  console.log('-'.repeat(70));
  console.log('步驟 1/2: 上傳索引檔案');
  console.log('-'.repeat(70));
  if (uploadFile('words_index', INDEX_FILE)) {
    successCount++;
  } else {
    failCount++;
    failedItems.push('words_index');
  }

  // 步驟 2: 上傳各分類的 NDJSON 檔案
  console.log('-'.repeat(70));
  console.log('步驟 2/2: 上傳分類檔案');
  console.log('-'.repeat(70));
  
  indexData.categories.forEach((cat, index) => {
    const categoryFile = path.join(DATA_DIR, `words_${cat.id}.ndjson`);
    const key = `words_${cat.id}`;
    
    console.log(`[${index + 1}/${indexData.categories.length}] ${cat.name}`);
    
    if (uploadFile(key, categoryFile)) {
      successCount++;
    } else {
      failCount++;
      failedItems.push(key);
    }
  });

  // 顯示摘要
  console.log('='.repeat(70));
  console.log('上傳完成摘要');
  console.log('='.repeat(70));
  console.log(`✓ 成功: ${successCount} 個檔案`);
  if (failCount > 0) {
    console.log(`✗ 失敗: ${failCount} 個檔案`);
    console.log('失敗項目:');
    failedItems.forEach(item => console.log(`  - ${item}`));
  }
  console.log('');

  if (failCount > 0) {
    console.error('❌ 部分檔案上傳失敗，請檢查錯誤訊息並重試。');
    process.exit(1);
  } else {
    console.log('✅ 所有檔案已成功上傳到 Cloudflare KV！');
    console.log('');
    console.log('KV 存儲結構:');
    console.log('  - words_index: 包含所有分類的索引和元數據');
    indexData.categories.forEach(cat => {
      console.log(`  - words_${cat.id}: ${cat.name} 的所有單詞 (NDJSON 格式)`);
    });
    console.log('');
    console.log('下一步:');
    console.log('  1. 執行 npm run deploy 部署到 Cloudflare Workers');
    console.log('  2. 測試 API 端點:');
    console.log('     - GET /words/categories');
    console.log('     - GET /words/gre');
    console.log('     - GET /words/gre/aberrant');
    console.log('     - GET /words/random?categories=gre,toefl');
  }
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = { uploadFile };
