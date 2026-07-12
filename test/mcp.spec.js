import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect, beforeAll } from 'vitest';
import worker from '../src';

describe('MCP Server Tests', () => {
	let ctx;

	beforeAll(() => {
		if (env.ANSWERS_BOOK) {
			env.ANSWERS_BOOK.get = async (key, options) => {
				if (key === 'SP500') return { price: 5000 };
				if (key === 'answersbook') return { "1": { answer: { "en": "Yes", "zh-TW": "是的" }, meta: { tone: "positive" } } };
				if (key === 'StrayBirds') return [
					{ num: 1, english: "Stray birds...", chinese: "飛鳥集..." }
				];
				return null;
			};
		}
	});

	it('responds to tools/list', async () => {
		const request = new Request('http://example.com/mcp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method: 'tools/list'
			})
		});
		ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.jsonrpc).toBe('2.0');
		expect(data.id).toBe(1);
		expect(data.result).toHaveProperty('tools');
		expect(Array.isArray(data.result.tools)).toBe(true);
		expect(data.result.tools.length).toBeGreaterThan(0);
	});

	it('responds to tools/call for get_answer', async () => {
		const request = new Request('http://example.com/mcp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 2,
				method: 'tools/call',
				params: {
					name: 'get_answer',
					arguments: { lang: 'en' }
				}
			})
		});
		ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.result.content[0].text).toBe('Yes');
	});

    it('responds to tools/call for get_market_data', async () => {
		const request = new Request('http://example.com/mcp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 3,
				method: 'tools/call',
				params: {
					name: 'get_market_data',
					arguments: { index: 'SP500' }
				}
			})
		});
		ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.result.content[0].text).toContain('5000');
	});

	it('responds to tools/call for get_stray_birds', async () => {
		const request = new Request('http://example.com/mcp', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 4,
				method: 'tools/call',
				params: {
					name: 'get_stray_birds',
					arguments: {}
				}
			})
		});
		ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);

		expect(response.status).toBe(200);
		const data = await response.json();
		expect(data.result.content[0].text).toContain('Stray birds...');
		expect(data.result.content[0].text).toContain('飛鳥集...');
	});
});
