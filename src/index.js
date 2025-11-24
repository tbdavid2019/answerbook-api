async function handleRequest(request) {
	const url = new URL(request.url);

    let response;
    if (url.pathname === '/') {
        const lang = url.searchParams.get('lang') || 'zh-TW'; 
        const answer = await getRandomAnswerFromKV(lang);
        response = new Response(JSON.stringify({ answer: answer }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (url.pathname === '/RandomPassword') {
        const password = generateRandomPassword();
        response = new Response(JSON.stringify({ RandomPassword: password }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (url.pathname === '/TangPoetry') {
        const poem = await getRandomPoemFromKV();
        response = new Response(JSON.stringify({ poem: poem }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (url.pathname === '/TempleOracleJP') {
        const oracle = await getRandomOracleFromKV();
        response = new Response(JSON.stringify({ oracle: oracle }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (url.pathname === '/greWord') {
        const greWord = await getRandomGreWordFromKV();
        response = new Response(JSON.stringify({ greWord: greWord }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (url.pathname === '/SP500') {
        const sp500Data = await ANSWERS_BOOK.get("SP500", "json");
        response = new Response(JSON.stringify({ SP500: sp500Data }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (url.pathname === '/TW0050') {
        const tw0050Data = await ANSWERS_BOOK.get("TW0050", "json");
        response = new Response(JSON.stringify({ TW0050: tw0050Data }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (url.pathname === '/TW0051') {
        const tw0051Data = await ANSWERS_BOOK.get("TW0051", "json");
        response = new Response(JSON.stringify({ TW0051: tw0051Data }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (url.pathname === '/nasdaq100') {
        const nasdaq100Data = await ANSWERS_BOOK.get("nasdaq100", "json");
        response = new Response(JSON.stringify({ nasdaq100: nasdaq100Data }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (url.pathname === '/answersWithMeta') {
        const lang = url.searchParams.get('lang') || 'zh-TW';
        const filters = extractMetaFilters(url.searchParams);
        const payload = await getRandomAnswerWithMeta(lang, filters);
        response = new Response(JSON.stringify(payload), {
            headers: { 'Content-Type': 'application/json' }
        });
    } else if (url.pathname === '/dowjones') {
        const dowjonesData = await ANSWERS_BOOK.get("dowjones", "json");
        response = new Response(JSON.stringify({ dowjones: dowjonesData }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        response = new Response("Invalid request", { status: 404 });
    }    


	// 添加 CORS headers
	response.headers.set('Access-Control-Allow-Origin', '*');
	response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

	return response;
}

// 从 KV 中获取随机答案
async function getRandomAnswerFromKV(lang) {
	try {
		const data = await ANSWERS_BOOK.get("answersbook", "json");

		if (!data) {
			throw new Error('KV data is null or undefined');
		}

		const keys = Object.keys(data);

		if (keys.length === 0) {
			throw new Error('No keys found in KV data');
		}

		const randomKey = keys[Math.floor(Math.random() * keys.length)];
		
		if (!data[randomKey].answer || !data[randomKey].answer[lang]) {
			throw new Error(`No answer found for key: ${randomKey} and language: ${lang}`);
		}

		return data[randomKey].answer[lang];
	} catch (error) {
		console.error('Error fetching random answer:', error);
		return `Error: ${error.message}`;
	}
}

// 获取包含 meta 的随机答案，可依 query 过滤
async function getRandomAnswerWithMeta(lang, filters) {
	const data = await ANSWERS_BOOK.get("answersbook", "json");

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

// 从 KV 中获取随机 GRE 单词
async function getRandomGreWordFromKV() {
	try {
		const data = await ANSWERS_BOOK.get("greWords", "json");

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
		const data = await ANSWERS_BOOK.get("TangPoetry", "json");

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
		const data = await ANSWERS_BOOK.get("TempleOracleJP", "json");

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
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const symbols = "-";
	let password = "";

	for (let i = 0; i < length; i++) {
		password += charset.charAt(Math.floor(Math.random() * charset.length));
	}

	// 插入符号 '-' 每 4 个字符后
	let formattedPassword = '';
	for (let i = 0; i < 4; i++) {
		formattedPassword += password.slice(i * 4, (i + 1) * 4) + (i < 3 ? symbols : '');
	}

	return formattedPassword;
}

addEventListener('fetch', event => {
	event.respondWith(handleRequest(event.request));
});
