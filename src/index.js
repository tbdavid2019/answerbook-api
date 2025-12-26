async function handleRequest(request) {
	const url = new URL(request.url);
	const pathname = url.pathname;
	let response;

	// Handle CORS preflight
	if (request.method === 'OPTIONS') {
		return handleCORS();
	}

	if (pathname === '/') {
		const lang = url.searchParams.get('lang');
		const answer = await getRandomAnswerFromKV(lang);
		response = createSuccessResponse({ answer: answer });
	} else if (pathname === '/RandomPassword') {
		const password = generateRandomPassword();
		response = createSuccessResponse({ RandomPassword: password });
	} else if (pathname === '/TangPoetry') {
		const poem = await getRandomPoemFromKV();
		response = createSuccessResponse({ poem: poem });
	} else if (pathname === '/TempleOracleJP') {
		const oracle = await getRandomOracleFromKV();
		response = createSuccessResponse({ oracle: oracle });
	} else if (pathname === '/greWord') {
		const greWord = await getRandomGreWordFromKV();
		response = createSuccessResponse({ greWord: greWord });
	} else if (pathname === '/SP500') {
		const sp500Data = await ANSWERS_BOOK.get('SP500', 'json');
		response = createSuccessResponse({ SP500: sp500Data });
	} else if (pathname === '/TW0050') {
		const tw0050Data = await ANSWERS_BOOK.get('TW0050', 'json');
		response = createSuccessResponse({ TW0050: tw0050Data });
	} else if (pathname === '/TW0051') {
		const tw0051Data = await ANSWERS_BOOK.get('TW0051', 'json');
		response = createSuccessResponse({ TW0051: tw0051Data });
	} else if (pathname === '/nasdaq100') {
		const nasdaq100Data = await ANSWERS_BOOK.get('nasdaq100', 'json');
		response = createSuccessResponse({ nasdaq100: nasdaq100Data });
	} else if (pathname === '/answersWithMeta') {
		const lang = url.searchParams.get('lang') || 'zh-TW';
		const filters = extractMetaFilters(url.searchParams);
		const payload = await getRandomAnswerWithMeta(lang, filters);
		response = createSuccessResponse(payload);
	} else if (pathname === '/dowjones') {
		const dowjonesData = await ANSWERS_BOOK.get('dowjones', 'json');
		response = createSuccessResponse({ dowjones: dowjonesData });
	} else if (pathname === '/answersOriginal') {
		const lang = url.searchParams.get('lang');
		const answer = await getRandomAnswerOriginalFromKV(lang);
		response = createSuccessResponse({ answer: answer });
	} else if (pathname === '/words/categories') {
		response = await handleGetCategories();
	} else if (pathname === '/words/random') {
		const categories = url.searchParams.get('categories');
		response = await handleGetRandomWord(categories);
	} else if (pathname.startsWith('/words/')) {
		const pathParts = pathname.split('/').filter(p => p);
		if (pathParts.length === 2) {
			response = await handleGetCategoryRandomWord(pathParts[1]);
		} else if (pathParts.length === 3) {
			response = await handleGetSpecificWord(pathParts[1], decodeURIComponent(pathParts[2]));
		} else {
			response = createErrorResponse('Invalid words API path', 404);
		}
	} else {
		response = createErrorResponse('Invalid request', 404);
	}

	// Add CORS headers
	response.headers.set('Access-Control-Allow-Origin', '*');
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

	return response;
}

// Handle CORS preflight requests
function handleCORS() {
	return new Response(null, {
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		}
	});
}

// 从 KV 中获取随机答案
async function getRandomAnswerFromKV(lang) {
	try {
		const data = await ANSWERS_BOOK.get('answersbook', 'json');

		if (!data) {
			throw new Error('KV data is null or undefined');
		}

		const keys = Object.keys(data);

		if (keys.length === 0) {
			throw new Error('No keys found in KV data');
		}

		const randomKey = keys[Math.floor(Math.random() * keys.length)];
		const answerData = data[randomKey].answer;
		
		if (!answerData) {
			throw new Error(`No answer found for key: ${randomKey}`);
		}

		// 如果沒有指定語言，返回雙語結果
		if (!lang) {
			const zhTW = answerData['zh-TW'] || '';
			const en = answerData['en'] || '';
			return `${zhTW}\n${en}`;
		}

		return answerData[lang] || answerData['zh-TW'] || answerData['en'];
	} catch (error) {
		console.error('Error fetching random answer:', error);
		return `Error: ${error.message}`;
	}
}

// 从 KV 中获取随机答案 (Original Enriched)
async function getRandomAnswerOriginalFromKV(lang) {
	try {
		const data = await ANSWERS_BOOK.get('answersbook_original', 'json');

		if (!data) {
			throw new Error('KV data is null or undefined');
		}

		const keys = Object.keys(data);

		if (keys.length === 0) {
			throw new Error('No keys found in KV data');
		}

		const randomKey = keys[Math.floor(Math.random() * keys.length)];
		const answerData = data[randomKey].answer;

		if (!answerData) {
			throw new Error(`No answer found for key: ${randomKey}`);
		}

		// 如果沒有指定語言，返回雙語結果
		if (!lang) {
			const zhTW = answerData['zh-TW'] || '';
			const en = answerData['en'] || '';
			return `${zhTW}\n${en}`;
		}

		return answerData[lang] || answerData['zh-TW'] || answerData['en'];
	} catch (error) {
		console.error('Error fetching random answer original:', error);
		return `Error: ${error.message}`;
	}
}

// 获取包含 meta 的随机答案，可依 query 过滤
async function getRandomAnswerWithMeta(lang, filters) {
	const data = await ANSWERS_BOOK.get('answersbook', 'json');

	if (!data) {
		throw new Error('KV data is null or undefined');
	}

	const entries = Object.entries(data).filter(([, value]) => matchesFilters(value.meta, filters));

	if (entries.length === 0) {
		throw new Error('No answers match the provided filters');
	}

	const [id, value] = entries[Math.floor(Math.random() * entries.length)];
	const localized = value.answer[lang] || value.answer['zh-TW'] || value.answer['en'];

	return {
		id,
		answer: localized,
		answer_i18n: value.answer,
		meta: value.meta
	};
}

function matchesFilters(meta = {}, filters) {
	if (!meta) return false;
	if (filters.tone && meta.tone !== filters.tone) return false;
	if (filters.mood && meta.mood !== filters.mood) return false;
	if (filters.style && meta.style !== filters.style) return false;
	if (filters.length && meta.length !== filters.length) return false;
	if (filters.themes.length > 0) {
		const themes = Array.isArray(meta.themes) ? meta.themes : [];
		if (!filters.themes.some(theme => themes.includes(theme))) return false;
	}
	return true;
}

function extractMetaFilters(searchParams) {
	const parseList = (key) => {
		const raw = searchParams.get(key);
		if (!raw) return [];
		return raw.split(',').map(v => v.trim()).filter(Boolean);
	};

	return {
		tone: searchParams.get('tone') || '',
		mood: searchParams.get('mood') || '',
		style: searchParams.get('style') || '',
		length: searchParams.get('length') || '',
		themes: parseList('themes')
	};
}

// ==================== 新的詞彙 API 函數 ====================

// 獲取所有可用的分類列表
async function handleGetCategories() {
	try {
		const indexData = await ANSWERS_BOOK.get('words_index', 'json');
		
		if (!indexData || !indexData.categories) {
			return createErrorResponse('Words index not found', 404);
		}

		return createSuccessResponse({
			categories: indexData.categories,
			total: indexData.categories.length,
			totalWords: indexData.totalWords
		});
	} catch (error) {
		console.error('Error in handleGetCategories:', error);
		return createErrorResponse(error.message, 500);
	}
}

// 獲取指定分類的隨機單詞
async function handleGetCategoryRandomWord(category) {
	try {
		const ndjsonData = await ANSWERS_BOOK.get(`words_${category}`, 'text');
		
		if (!ndjsonData) {
			return createErrorResponse(`Category '${category}' not found`, 404);
		}

		const lines = ndjsonData.trim().split('\n');
		const randomIndex = Math.floor(Math.random() * lines.length);
		const randomWord = JSON.parse(lines[randomIndex]);

		return createSuccessResponse(randomWord);
	} catch (error) {
		console.error('Error in handleGetCategoryRandomWord:', error);
		return createErrorResponse(error.message, 500);
	}
}

// 獲取特定單詞的詳細信息
async function handleGetSpecificWord(category, word) {
	try {
		const ndjsonData = await ANSWERS_BOOK.get(`words_${category}`, 'text');
		
		if (!ndjsonData) {
			return createErrorResponse(`Category '${category}' not found`, 404);
		}

		const lines = ndjsonData.trim().split('\n');
		const searchWord = word.toLowerCase();
		
		for (const line of lines) {
			const wordObj = JSON.parse(line);
			if (wordObj.word && wordObj.word.toLowerCase() === searchWord) {
				return createSuccessResponse(wordObj);
			}
		}

		return createErrorResponse(`Word '${word}' not found in category '${category}'`, 404);
	} catch (error) {
		console.error('Error in handleGetSpecificWord:', error);
		return createErrorResponse(error.message, 500);
	}
}

// 獲取任意分類的隨機單詞
async function handleGetRandomWord(categoriesParam) {
	try {
		const indexData = await ANSWERS_BOOK.get('words_index', 'json');
		
		if (!indexData || !indexData.categories) {
			return createErrorResponse('Words index not found', 404);
		}

		let availableCategories = indexData.categories.map(cat => cat.id);

		if (categoriesParam) {
			const requestedCategories = categoriesParam.split(',').map(c => c.trim().toLowerCase());
			availableCategories = availableCategories.filter(cat =>
				requestedCategories.includes(cat.toLowerCase())
			);

			if (availableCategories.length === 0) {
				return createErrorResponse('No valid categories found', 400);
			}
		}

		const randomCategory = availableCategories[Math.floor(Math.random() * availableCategories.length)];
		const ndjsonData = await ANSWERS_BOOK.get(`words_${randomCategory}`, 'text');
		
		if (!ndjsonData) {
			return createErrorResponse('Category data not found', 500);
		}

		const lines = ndjsonData.trim().split('\n');
		const randomIndex = Math.floor(Math.random() * lines.length);
		const randomWord = JSON.parse(lines[randomIndex]);

		return createSuccessResponse(randomWord);
	} catch (error) {
		console.error('Error in handleGetRandomWord:', error);
		return createErrorResponse(error.message, 500);
	}
}

// Create success response
function createSuccessResponse(data) {
	return new Response(JSON.stringify({
		success: true,
		data: data
	}), {
		status: 200,
		headers: { 'Content-Type': 'application/json' }
	});
}

// Create error response
function createErrorResponse(message, status = 500) {
	return new Response(JSON.stringify({
		success: false,
		error: message
	}), {
		status: status,
		headers: { 'Content-Type': 'application/json' }
	});
}

// 从 KV 中获取随机 GRE 单词
async function getRandomGreWordFromKV() {
	try {
		const data = await ANSWERS_BOOK.get('greWords', 'json');

		if (!data || !data.words) {
			throw new Error('No GRE words found in KV data');
		}

		const randomIndex = Math.floor(Math.random() * data.words.length);
		return data.words[randomIndex];
	} catch (error) {
		console.error('Error fetching random GRE word:', error);
		return `Error: ${error.message}`;
	}
}

// 随机获取唐诗
async function getRandomPoemFromKV() {
	try {
		const data = await ANSWERS_BOOK.get('TangPoetry', 'json');

		if (!data) {
			throw new Error('KV data is null or undefined');
		}

		const randomIndex = Math.floor(Math.random() * data.length);
		return data[randomIndex];
	} catch (error) {
		console.error('Error fetching random poem:', error);
		return `Error: ${error.message}`;
	}
}

// 随机获取浅草籤
async function getRandomOracleFromKV() {
	try {
		const data = await ANSWERS_BOOK.get('TempleOracleJP', 'json');

		if (!data) {
			throw new Error('KV data is null or undefined');
		}

		const randomIndex = Math.floor(Math.random() * data.length);
		return data[randomIndex];
	} catch (error) {
		console.error('Error fetching random oracle:', error);
		return `Error: ${error.message}`;
	}
}

// 随机密码生成
function generateRandomPassword() {
	const length = 16;
	const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const symbols = '-';
	let password = '';

	for (let i = 0; i < length; i++) {
		password += charset.charAt(Math.floor(Math.random() * charset.length));
	}

	// Insert '-' every 4 chars
	let formattedPassword = '';
	for (let i = 0; i < 4; i++) {
		formattedPassword += password.slice(i * 4, (i + 1) * 4) + (i < 3 ? symbols : '');
	}

	return formattedPassword;
}

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request));
});
