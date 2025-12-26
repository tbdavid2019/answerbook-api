#!/usr/bin/env node

/**
 * 詞彙數據整合腳本
 * 功能：解析並整合 words 目錄下的所有 JSON 文件
 * 統一數據格式並生成分類索引
 */

const fs = require('fs');
const path = require('path');

const WORDS_DIR = path.join(__dirname, '../data/words');
const OUTPUT_FILE = path.join(__dirname, '../data/words_processed.json');

// 詞彙分類配置
const CATEGORIES = {
  gre: { path: 'GRE/GRE.json', name: 'GRE', fullName: 'Graduate Record Examination' },
  gmat: { path: 'GMAT/GMAT詞彙.json', name: 'GMAT', fullName: 'Graduate Management Admission Test' },
  ielts: { path: 'IELTS/雅思詞彙.json', name: 'IELTS', fullName: 'International English Language Testing System' },
  toefl: { path: 'TOEFL/TOEFL詞彙.json', name: 'TOEFL', fullName: 'Test of English as a Foreign Language' },
  sat: { path: 'SAT/SAT詞彙.json', name: 'SAT', fullName: 'Scholastic Assessment Test' }
};

/**
 * 解析單個單詞條目，提取核心字段
 */
function parseWordEntry(entry, category) {
  const content = entry.content?.word?.content || {};
  
  // 提取音標信息
  const pronunciation = {
    ipa: content.phone || '',
    us: content.usphone || '',
    uk: content.ukphone || '',
    audioUS: content.usspeech || '',
    audioUK: content.ukspeech || ''
  };

  // 提取詞義
  const definitions = (content.trans || []).map(t => ({
    partOfSpeech: t.pos || '',
    chinese: t.tranCn || '',
    english: t.tranOther || ''
  }));

  // 提取例句
  const examples = (content.sentence?.sentences || []).map(s => ({
    sentence: s.sContent || '',
    translation: s.sCn || ''
  }));

  // 提取同義詞
  const synonyms = [];
  if (content.syno?.synos) {
    content.syno.synos.forEach(syn => {
      if (syn.hwds) {
        syn.hwds.forEach(h => {
          if (h.w) synonyms.push(h.w);
        });
      }
    });
  }

  // 提取相關詞
  const relatedWords = [];
  if (content.relWord?.rels) {
    content.relWord.rels.forEach(rel => {
      if (rel.words) {
        rel.words.forEach(w => {
          if (w.hwd && w.tran) {
            relatedWords.push({
              word: w.hwd,
              relation: rel.pos || '',
              meaning: w.tran
            });
          }
        });
      }
    });
  }

  // 提取記憶技巧
  const memoryTip = content.remMethod?.val || '';

  // 提取短語
  const phrases = (content.phrase?.phrases || []).map(p => ({
    phrase: p.pContent || '',
    meaning: p.pCn || ''
  }));

  // 提取反義詞
  const antonyms = [];
  if (content.antos?.anto) {
    content.antos.anto.forEach(a => {
      if (a.hwd) antonyms.push(a.hwd);
    });
  }

  return {
    word: entry.headWord || '',
    category: category,
    wordRank: entry.wordRank || 0,
    pronunciation: pronunciation,
    definitions: definitions,
    examples: examples,
    synonyms: synonyms,
    antonyms: antonyms,
    relatedWords: relatedWords,
    memoryTip: memoryTip,
    phrases: phrases,
    bookId: entry.bookId || ''
  };
}

/**
 * 讀取並解析 NDJSON 文件（每行一個 JSON 對象）
 */
function readNDJSON(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  return lines.map(line => {
    try {
      return JSON.parse(line);
    } catch (error) {
      console.error(`Error parsing line in ${filePath}:`, error.message);
      return null;
    }
  }).filter(item => item !== null);
}

/**
 * 處理所有詞彙文件
 */
function processAllWords() {
  const result = {
    metadata: {
      generatedAt: new Date().toISOString(),
      totalCategories: Object.keys(CATEGORIES).length,
      categories: {}
    },
    words: {},
    index: {}
  };

  console.log('開始處理詞彙文件...\n');

  // 處理每個分類
  for (const [categoryKey, categoryInfo] of Object.entries(CATEGORIES)) {
    const filePath = path.join(WORDS_DIR, categoryInfo.path);
    
    console.log(`處理 ${categoryInfo.name} (${categoryInfo.fullName})...`);
    
    try {
      if (!fs.existsSync(filePath)) {
        console.warn(`  ⚠️  文件不存在: ${filePath}`);
        continue;
      }

      const entries = readNDJSON(filePath);
      const processedWords = entries.map(entry => parseWordEntry(entry, categoryKey));

      // 存儲到 words 對象中
      if (!result.words[categoryKey]) {
        result.words[categoryKey] = [];
      }
      result.words[categoryKey] = processedWords;

      // 創建索引（按單詞首字母）
      if (!result.index[categoryKey]) {
        result.index[categoryKey] = {};
      }

      processedWords.forEach((word, idx) => {
        const firstLetter = word.word.charAt(0).toLowerCase();
        if (!result.index[categoryKey][firstLetter]) {
          result.index[categoryKey][firstLetter] = [];
        }
        result.index[categoryKey][firstLetter].push(idx);
      });

      // 更新元數據
      result.metadata.categories[categoryKey] = {
        name: categoryInfo.name,
        fullName: categoryInfo.fullName,
        totalWords: processedWords.length,
        firstWord: processedWords[0]?.word || '',
        lastWord: processedWords[processedWords.length - 1]?.word || ''
      };

      console.log(`  ✓ 已處理 ${processedWords.length} 個單詞\n`);
    } catch (error) {
      console.error(`  ✗ 處理失敗: ${error.message}\n`);
    }
  }

  // 計算總單詞數
  result.metadata.totalWords = Object.values(result.words).reduce(
    (sum, words) => sum + words.length, 
    0
  );

  console.log('生成統計信息...');
  console.log(`  總分類數: ${result.metadata.totalCategories}`);
  console.log(`  總單詞數: ${result.metadata.totalWords}`);
  console.log('');

  return result;
}

/**
 * 主函數
 */
function main() {
  console.log('='.repeat(60));
  console.log('詞彙數據整合腳本');
  console.log('='.repeat(60));
  console.log('');

  try {
    const processedData = processAllWords();

    // 為每個分類創建獨立的 NDJSON 檔案（用於分批上傳到 KV）
    const dataDir = path.dirname(OUTPUT_FILE);
    
    console.log('生成分類檔案...');
    Object.entries(processedData.words).forEach(([category, words]) => {
      const categoryPath = path.join(dataDir, `words_${category}.ndjson`);
      const ndjsonContent = words.map(word => JSON.stringify(word)).join('\n');
      fs.writeFileSync(categoryPath, ndjsonContent, 'utf8');
      const fileSizeMB = (Buffer.byteLength(ndjsonContent, 'utf8') / 1024 / 1024).toFixed(2);
      console.log(`  ✓ ${category}: ${words.length} 個單詞 (${fileSizeMB} MB)`);
    });
    console.log('');

    // 創建輕量級索引文件
    const indexPath = path.join(dataDir, 'words_index.json');
    const indexData = {
      version: processedData.metadata.version,
      lastUpdated: processedData.metadata.lastUpdated,
      totalWords: processedData.metadata.totalWords,
      totalCategories: processedData.metadata.totalCategories,
      categories: Object.entries(processedData.metadata.categories).map(([key, info]) => ({
        id: key,
        name: info.name,
        fullName: info.fullName,
        totalWords: info.totalWords
      }))
    };
    fs.writeFileSync(indexPath, JSON.stringify(indexData, null, 2), 'utf8');
    console.log(`✓ 索引文件生成成功: ${indexPath}\n`);

    // 生成摘要信息
    console.log('處理完成摘要:');
    console.log('='.repeat(60));
    Object.entries(processedData.metadata.categories).forEach(([key, info]) => {
      console.log(`${info.name.padEnd(10)} | ${info.totalWords.toString().padStart(6)} words | ${info.firstWord} → ${info.lastWord}`);
    });
    console.log('='.repeat(60));
    console.log(`總計: ${processedData.metadata.totalWords} 個單詞`);
    console.log('');

  } catch (error) {
    console.error('✗ 處理失敗:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// 執行主函數
if (require.main === module) {
  main();
}

module.exports = { processAllWords, parseWordEntry };
