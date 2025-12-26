# Words API 使用指南 | Words API Usage Guide

## 快速開始 | Quick Start

### 1. 數據準備 | Data Preparation

首先，處理並整合所有詞彙文件：

```bash
npm run prepare-words
```

這個命令會：
- 讀取 `data/words/` 下的所有詞彙 JSON 文件
- 解析並標準化數據格式
- 生成分類索引
- 輸出到 `data/words_processed.json`

### 2. 上傳到 KV | Upload to KV

處理完數據後，上傳到 Cloudflare KV：

```bash
npm run upload-words
```

或者一鍵執行數據準備和上傳：

```bash
npm run build-data
```

### 3. 部署 | Deploy

```bash
npm run deploy
```

---

## API 使用示例 | API Usage Examples

### 獲取所有分類 | Get All Categories

```bash
curl https://your-worker.workers.dev/words/categories
```

**響應示例 | Response Example:**
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
      },
      {
        "id": "ielts",
        "name": "IELTS",
        "fullName": "International English Language Testing System",
        "totalWords": 9214
      },
      {
        "id": "gmat",
        "name": "GMAT",
        "fullName": "Graduate Management Admission Test",
        "totalWords": 3255
      },
      {
        "id": "sat",
        "name": "SAT",
        "fullName": "Scholastic Assessment Test",
        "totalWords": 4424
      }
    ],
    "total": 5
  }
}
```

---

### 獲取 GRE 隨機單詞 | Get Random GRE Word

```bash
curl https://your-worker.workers.dev/words/gre
```

**響應示例 | Response Example:**
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
      "audioUS": "aberrant&type=2",
      "audioUK": "aberrant&type=1"
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
        "sentence": "His aberrant behavior alarmed his friends.",
        "translation": "他的異常行為讓朋友們感到擔憂。"
      }
    ],
    "synonyms": [
      "abnormal",
      "deviant",
      "anomalous"
    ],
    "antonyms": [],
    "relatedWords": [
      {
        "word": "aberration",
        "relation": "n",
        "meaning": "偏差；異常"
      }
    ],
    "memoryTip": "ab(離開) + err(錯誤) + ant → 偏離正常的 → 異常的",
    "phrases": [
      {
        "phrase": "aberrant behavior",
        "meaning": "異常行為"
      }
    ],
    "bookId": "GRE_2"
  }
}
```

---

### 獲取特定單詞 | Get Specific Word

```bash
curl https://your-worker.workers.dev/words/gre/aberrant
```

響應格式同上。

---

### 從多個分類獲取隨機單詞 | Get Random Word from Multiple Categories

```bash
# 從所有分類隨機
curl https://your-worker.workers.dev/words/random

# 從 GRE 和 TOEFL 隨機
curl https://your-worker.workers.dev/words/random?categories=gre,toefl

# 從 IELTS, TOEFL, SAT 隨機
curl https://your-worker.workers.dev/words/random?categories=ielts,toefl,sat
```

---

## 前端集成示例 | Frontend Integration Examples

### JavaScript (Vanilla)

```javascript
// 獲取所有分類
async function getCategories() {
  const response = await fetch('https://your-worker.workers.dev/words/categories');
  const data = await response.json();
  
  if (data.success) {
    console.log('Categories:', data.data.categories);
  }
}

// 獲取隨機單詞
async function getRandomWord(category) {
  const response = await fetch(`https://your-worker.workers.dev/words/${category}`);
  const data = await response.json();
  
  if (data.success) {
    console.log('Word:', data.data.word);
    console.log('Definition:', data.data.definitions[0].chinese);
    console.log('Example:', data.data.examples[0]?.sentence);
  }
}

// 使用
getCategories();
getRandomWord('gre');
```

### React

```jsx
import { useState, useEffect } from 'react';

function WordCard() {
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRandomWord = async (category = 'gre') => {
    setLoading(true);
    try {
      const response = await fetch(`https://your-worker.workers.dev/words/${category}`);
      const data = await response.json();
      
      if (data.success) {
        setWord(data.data);
      }
    } catch (error) {
      console.error('Error fetching word:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomWord();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!word) return <div>No word available</div>;

  return (
    <div className="word-card">
      <h2>{word.word}</h2>
      <p className="pronunciation">{word.pronunciation.ipa}</p>
      
      <div className="definitions">
        {word.definitions.map((def, idx) => (
          <div key={idx}>
            <span className="pos">{def.partOfSpeech}</span>
            <p>{def.chinese}</p>
            <p className="english">{def.english}</p>
          </div>
        ))}
      </div>

      {word.examples.length > 0 && (
        <div className="examples">
          <h3>例句</h3>
          {word.examples.map((ex, idx) => (
            <div key={idx}>
              <p>{ex.sentence}</p>
              <p className="translation">{ex.translation}</p>
            </div>
          ))}
        </div>
      )}

      {word.synonyms.length > 0 && (
        <div className="synonyms">
          <strong>同義詞：</strong>
          {word.synonyms.join(', ')}
        </div>
      )}

      {word.memoryTip && (
        <div className="memory-tip">
          <strong>記憶技巧：</strong>
          {word.memoryTip}
        </div>
      )}

      <button onClick={() => fetchRandomWord(word.category)}>
        下一個單詞
      </button>
    </div>
  );
}

export default WordCard;
```

### Vue 3

```vue
<template>
  <div class="word-card" v-if="word">
    <h2>{{ word.word }}</h2>
    <p class="pronunciation">{{ word.pronunciation.ipa }}</p>
    
    <div class="definitions">
      <div v-for="(def, idx) in word.definitions" :key="idx">
        <span class="pos">{{ def.partOfSpeech }}</span>
        <p>{{ def.chinese }}</p>
        <p class="english">{{ def.english }}</p>
      </div>
    </div>

    <div v-if="word.examples.length > 0" class="examples">
      <h3>例句</h3>
      <div v-for="(ex, idx) in word.examples" :key="idx">
        <p>{{ ex.sentence }}</p>
        <p class="translation">{{ ex.translation }}</p>
      </div>
    </div>

    <button @click="fetchRandomWord">下一個單詞</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const word = ref(null);
const loading = ref(false);

const fetchRandomWord = async (category = 'gre') => {
  loading.value = true;
  try {
    const response = await fetch(`https://your-worker.workers.dev/words/${category}`);
    const data = await response.json();
    
    if (data.success) {
      word.value = data.data;
    }
  } catch (error) {
    console.error('Error fetching word:', error);
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchRandomWord();
});
</script>
```

---

## 錯誤處理 | Error Handling

### 錯誤響應格式 | Error Response Format

```json
{
  "success": false,
  "error": "Category 'xyz' not found"
}
```

### 常見錯誤碼 | Common Error Codes

- **400 Bad Request**: 無效的參數
- **404 Not Found**: 資源不存在（分類或單詞）
- **500 Internal Server Error**: 服務器內部錯誤

### 錯誤處理示例 | Error Handling Example

```javascript
async function fetchWord(category, word) {
  try {
    const response = await fetch(`https://your-worker.workers.dev/words/${category}/${word}`);
    const data = await response.json();
    
    if (!data.success) {
      // 處理 API 返回的錯誤
      console.error('API Error:', data.error);
      return null;
    }
    
    return data.data;
  } catch (error) {
    // 處理網絡錯誤
    console.error('Network Error:', error);
    return null;
  }
}
```

---

## 性能優化建議 | Performance Optimization Tips

1. **緩存分類列表**: 分類列表不常變動，可在前端緩存
2. **預加載**: 可以在用戶查看當前單詞時預加載下一個單詞
3. **錯誤重試**: 網絡錯誤時實現自動重試機制
4. **本地存儲**: 可將學習過的單詞存儲在 LocalStorage

```javascript
// 緩存分類列表示例
const CACHE_KEY = 'words_categories';
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24小時

async function getCategoriesWithCache() {
  const cached = localStorage.getItem(CACHE_KEY);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_DURATION) {
      return data;
    }
  }
  
  const response = await fetch('https://your-worker.workers.dev/words/categories');
  const result = await response.json();
  
  if (result.success) {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      data: result.data,
      timestamp: Date.now()
    }));
    return result.data;
  }
}
```

---

## 支持的分類 | Supported Categories

| ID | 名稱 | 全稱 | 單詞數量 |
|----|------|------|----------|
| `gre` | GRE | Graduate Record Examination | ~7,200 |
| `gmat` | GMAT | Graduate Management Admission Test | ~3,255 |
| `ielts` | IELTS | International English Language Testing System | ~9,214 |
| `toefl` | TOEFL | Test of English as a Foreign Language | ~9,214 |
| `sat` | SAT | Scholastic Assessment Test | ~4,424 |

---

## 數據結構說明 | Data Structure Description

### Word Object 完整結構

```typescript
interface Word {
  word: string;              // 單詞
  category: string;          // 所屬分類 (gre, toefl, etc.)
  wordRank: number;          // 單詞序號
  pronunciation: {           // 發音信息
    ipa: string;            // 國際音標
    us: string;             // 美式音標
    uk: string;             // 英式音標
    audioUS: string;        // 美式發音音頻
    audioUK: string;        // 英式發音音頻
  };
  definitions: Array<{       // 詞義列表
    partOfSpeech: string;   // 詞性 (n, v, adj, adv, etc.)
    chinese: string;        // 中文釋義
    english: string;        // 英文釋義
  }>;
  examples: Array<{          // 例句列表
    sentence: string;       // 例句
    translation: string;    // 中文翻譯
  }>;
  synonyms: string[];        // 同義詞列表
  antonyms: string[];        // 反義詞列表
  relatedWords: Array<{      // 相關詞列表
    word: string;           // 相關詞
    relation: string;       // 關係 (詞性等)
    meaning: string;        // 釋義
  }>;
  memoryTip: string;         // 記憶技巧/詞根詞綴解析
  phrases: Array<{           // 常用短語
    phrase: string;         // 短語
    meaning: string;        // 釋義
  }>;
  bookId: string;            // 來源書籍ID
}
```

---

## 常見問題 | FAQ

### Q: 如何添加新的詞彙分類？

A: 在 `data/words/` 目錄下創建新的子目錄，放入 NDJSON 格式的詞彙文件，然後更新 `scripts/prepare-words-data.js` 中的 `CATEGORIES` 配置。

### Q: 數據多久更新一次？

A: 數據存儲在 Cloudflare KV 中，更新頻率取決於你執行 `npm run upload-words` 的頻率。

### Q: API 有速率限制嗎？

A: 使用 Cloudflare Workers 的默認限制，免費版每天 100,000 次請求。

### Q: 可以批量獲取單詞嗎？

A: 當前版本不支持批量獲取，建議多次調用 API 或聯繫我們討論需求。

---

## 技術支持 | Technical Support

如有問題或建議，請在 GitHub 上提交 Issue：
https://github.com/tbdavid2019/answerbook-api/issues
