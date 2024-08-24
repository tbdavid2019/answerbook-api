/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
// 导入 KV 存储
//import { ANSWERS_BOOK } from 'answersbook_i18n.json';

async function handleRequest(request) {
	const url = new URL(request.url);
  
	if (url.pathname === '/') {
	  const lang = url.searchParams.get('lang') || 'zh-TW'; // 获取语言参数，默认为 'zh-TW'
	  const answer = await getRandomAnswerFromKV(lang);
	  return new Response(JSON.stringify({ answer: answer }), {
		headers: { 'Content-Type': 'application/json' },
	  });
	} else if (url.pathname === '/RandomPassword') {
	  const password = generateRandomPassword();
	  return new Response(JSON.stringify({ RandomPassword: password }), {
		headers: { 'Content-Type': 'application/json' },
	  });
	} else {
	  return new Response("Invalid request", { status: 404 });
	}
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