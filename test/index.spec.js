import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect, beforeAll } from 'vitest';
import worker from '../src';

// Mock 詞彙數據
const mockWordsData = {
	metadata: {
		totalWords: 100,
		totalCategories: 5,
		categories: [
			{ id: 'gre', name: 'GRE', fullName: 'Graduate Record Examination', totalWords: 30 },
			{ id: 'toefl', name: 'TOEFL', fullName: 'Test of English as a Foreign Language', totalWords: 25 },
			{ id: 'ielts', name: 'IELTS', fullName: 'International English Language Testing System', totalWords: 25 },
			{ id: 'gmat', name: 'GMAT', fullName: 'Graduate Management Admission Test', totalWords: 10 },
			{ id: 'sat', name: 'SAT', fullName: 'Scholastic Assessment Test', totalWords: 10 }
		]
	},
	words: {
		gre: [
			{
				word: 'aberrant',
				category: 'gre',
				wordRank: 1,
				pronunciation: { ipa: 'æ\'berənt', us: 'æ\'berənt', uk: 'æ\'berənt' },
				definitions: [{ partOfSpeech: 'adj', chinese: '異常的', english: 'departing from normal' }],
				examples: [{ sentence: 'His aberrant behavior', translation: '他的異常行為' }],
				synonyms: ['abnormal', 'deviant'],
				antonyms: ['normal'],
				relatedWords: [],
				memoryTip: 'ab(離開) + err(錯) + ant → 偏離正軌的 → 異常的',
				phrases: []
			}
		],
		toefl: [
			{
				word: 'abundant',
				category: 'toefl',
				wordRank: 1,
				pronunciation: { ipa: 'ə\'bʌndənt', us: 'ə\'bʌndənt', uk: 'ə\'bʌndənt' },
				definitions: [{ partOfSpeech: 'adj', chinese: '豐富的', english: 'existing in large quantities' }],
				examples: [],
				synonyms: ['plentiful'],
				antonyms: ['scarce'],
				relatedWords: [],
				memoryTip: '',
				phrases: []
			}
		]
	}
};

describe('Answerbook API Tests', () => {
	let ctx;

	beforeAll(() => {
		// 設置 mock KV 數據
		if (env.ANSWERS_BOOK) {
			env.ANSWERS_BOOK.get = async (key, options) => {
				const type = typeof options === 'string' ? options : options?.type;
				let value = null;

				if (key === 'words_index') {
					value = JSON.stringify(mockWordsData.metadata);
				} else if (key.startsWith('words_')) {
					const category = key.replace('words_', '');
					if (mockWordsData.words[category]) {
						value = mockWordsData.words[category].map(w => JSON.stringify(w)).join('\n');
					}
				}

				if (value === null) return null;
				if (type === 'json') return JSON.parse(value);
				return value;
			};
		}
	});

	// Swagger UI Check
	it('responds to root path (/) with Swagger UI', async () => {
		const request = new Request('http://example.com/');
		ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		const text = await response.text();
		expect(text).toContain('html'); // Basic check for HTML content
	});

	// Moved Root logic validation
	it('responds to /answers with random answer (Legacy Flat Schema)', async () => {
		const request = new Request('http://example.com/answers');
		ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		const data = await response.json();
		// Legacy Schema: { answer: ... }
		expect(data).toHaveProperty('answer');
		expect(data).not.toHaveProperty('success');
	});

	// ==================== 新的詞彙 API 測試 ====================

	describe('Words API - GET /words/categories', () => {
		it('should return all available categories', async () => {
			const request = new Request('http://example.com/words/categories');
			ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(200);
			const data = await response.json();

			expect(data.success).toBe(true);
			expect(data.data).toHaveProperty('categories');
			expect(data.data).toHaveProperty('total');
			expect(data.data.total).toBe(5);
			expect(Array.isArray(data.data.categories)).toBe(true);

			// 檢查分類結構
			const category = data.data.categories[0];
			expect(category).toHaveProperty('id');
			expect(category).toHaveProperty('name');
			expect(category).toHaveProperty('fullName');
			expect(category).toHaveProperty('totalWords');
		});
	});

	describe('Words API - GET /words/{category}', () => {
		it('should return a random word from GRE category', async () => {
			const request = new Request('http://example.com/words/gre');
			ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(200);
			const data = await response.json();

			expect(data.success).toBe(true);
			expect(data.data).toHaveProperty('word');
			expect(data.data).toHaveProperty('category');
			expect(data.data.category).toBe('gre');
			expect(data.data).toHaveProperty('pronunciation');
			expect(data.data).toHaveProperty('definitions');
			expect(Array.isArray(data.data.definitions)).toBe(true);
		});

		it('should return 404 for non-existent category', async () => {
			const request = new Request('http://example.com/words/nonexistent');
			ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(404);
			const data = await response.json();
			expect(data.success).toBe(false);
			expect(data).toHaveProperty('error');
		});
	});

	describe('Words API - GET /words/{category}/{word}', () => {
		it('should return specific word details', async () => {
			const request = new Request('http://example.com/words/gre/aberrant');
			ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(200);
			const data = await response.json();

			expect(data.success).toBe(true);
			expect(data.data.word).toBe('aberrant');
			expect(data.data.category).toBe('gre');
			expect(data.data).toHaveProperty('definitions');
			expect(data.data).toHaveProperty('examples');
			expect(data.data).toHaveProperty('synonyms');
		});

		it('should return 404 for non-existent word', async () => {
			const request = new Request('http://example.com/words/gre/nonexistentword');
			ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(404);
			const data = await response.json();
			expect(data.success).toBe(false);
		});
	});

	describe('Words API - GET /words/random', () => {
		it('should return a random word from all categories', async () => {
			const request = new Request('http://example.com/words/random');
			ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(200);
			const data = await response.json();

			expect(data.success).toBe(true);
			expect(data.data).toHaveProperty('word');
			expect(data.data).toHaveProperty('category');
			expect(['gre', 'toefl', 'ielts', 'gmat', 'sat']).toContain(data.data.category);
		});

		it('should return a random word from specified categories', async () => {
			const request = new Request('http://example.com/words/random?categories=gre,toefl');
			ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(200);
			const data = await response.json();

			expect(data.success).toBe(true);
			expect(['gre', 'toefl']).toContain(data.data.category);
		});

		it('should return 400 for invalid categories', async () => {
			const request = new Request('http://example.com/words/random?categories=invalid');
			ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(400);
			const data = await response.json();
			expect(data.success).toBe(false);
		});
	});

	describe('CORS Headers', () => {
		it('should include CORS headers in response', async () => {
			const request = new Request('http://example.com/words/categories', {
				headers: { 'Origin': 'http://example.com' }
			});
			ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
			// expect(response.headers.get('Access-Control-Allow-Methods')).toContain('GET');
		});

		it('should handle OPTIONS request for CORS preflight', async () => {
			const request = new Request('http://example.com/words/categories', {
				method: 'OPTIONS',
				headers: { 'Origin': 'http://example.com' }
			});
			ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(204);
			expect(response.headers.get('Access-Control-Allow-Origin')).toBe('*');
		});
	});

	describe('Error Handling', () => {
		it('should return 404 for invalid paths', async () => {
			const request = new Request('http://example.com/invalid/path');
			ctx = createExecutionContext();
			const response = await worker.fetch(request, env, ctx);
			await waitOnExecutionContext(ctx);

			expect(response.status).toBe(404);
			const data = await response.json();
			expect(data.success).toBe(false);
			expect(data).toHaveProperty('error');
		});
	});
});
