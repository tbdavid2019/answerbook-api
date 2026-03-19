
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { cors } from 'hono/cors'
import { handleMCPRequest } from './mcp'

const app = new OpenAPIHono()

app.use('/*', cors())

// Define Schemas
const SuccessResponseSchema = z.object({
    success: z.boolean().default(true),
    data: z.object({}).passthrough().optional(),
    error: z.string().optional()
})

const AnswerSchema = z.object({
    answer: z.string()
})

const PasswordSchema = z.object({
    RandomPassword: z.string()
})

const MetaSchema = z.object({
    id: z.string(),
    answer: z.string(),
    answer_i18n: z.object({
        'zh-TW': z.string().optional(),
        en: z.string().optional()
    }).optional(),
    meta: z.object({
        tone: z.string().optional(),
        mood: z.string().optional(),
        style: z.string().optional(),
        length: z.string().optional(),
        themes: z.array(z.string()).optional()
    }).optional()
})

// --- Routes ---

// 1. Swagger UI at Root
app.get('/', swaggerUI({ url: '/doc' }))

// 2. OpenAPI Spec JSON
app.doc('/doc', {
    openapi: '3.0.0',
    info: {
        version: '1.0.0',
        title: 'AnswerBook API',
        description: 'API for Book of Answers, Random Passwords, Market Data, and Vocabulary Learning'
    }
})

// 3. Book of Answers (Moved from / to /answers)
app.openapi(
    createRoute({
        method: 'get',
        path: '/answers',
        tags: ['Answer Book'],
        description: 'Get a random answer (Legacy Generation 1)',
        request: {
            query: z.object({
                lang: z.enum(['en', 'zh-TW', '']).optional()
            })
        },
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: AnswerSchema
                    }
                },
                description: 'Random answer response'
            }
        }
    }),
    async (c) => {
        const lang = c.req.query('lang')
        const answer = await getRandomAnswerFromKV(c.env, lang)
        return c.json({ answer })
    }
)

// 4. Random Password
app.openapi(
    createRoute({
        method: 'get',
        path: '/RandomPassword',
        tags: ['Utilities'],
        description: 'Generate a secure random password',
        responses: {
            200: {
                content: {
                    'application/json': {
                        schema: PasswordSchema
                    }
                },
                description: 'Random password'
            }
        }
    }),
    (c) => {
        const password = generateRandomPassword()
        return c.json({ RandomPassword: password })
    }
)

// 5. Tang Poetry
app.openapi(
    createRoute({
        method: 'get',
        path: '/TangPoetry',
        tags: ['Culture'],
        description: 'Get a random Tang poem',
        responses: {
            200: {
                description: 'Random poem',
                content: {
                    'application/json': {
                        schema: z.object({ poem: z.object({}).passthrough() })
                    }
                }
            }
        }
    }),
    async (c) => {
        const poem = await getRandomPoemFromKV(c.env)
        return c.json({ poem })
    }
)

// 6. Temple Oracle (JP)
app.openapi(
    createRoute({
        method: 'get',
        path: '/TempleOracleJP',
        tags: ['Culture'],
        description: 'Get a random Japanese Temple Oracle',
        responses: {
            200: {
                description: 'Random oracle',
                content: {
                    'application/json': {
                        schema: z.object({ oracle: z.object({}).passthrough() })
                    }
                }
            }
        }
    }),
    async (c) => {
        const oracle = await getRandomOracleFromKV(c.env)
        return c.json({ oracle })
    }
)

// 7. Market Data Routes
const marketRoutes = [
    { path: '/SP500', key: 'SP500', desc: 'S&P 500 Data' },
    { path: '/nasdaq100', key: 'nasdaq100', desc: 'Nasdaq 100 Data' },
    { path: '/dowjones', key: 'dowjones', desc: 'Dow Jones Data' },
    { path: '/TW0050', key: 'TW0050', desc: 'TW0050 Data' },
    { path: '/TW0051', key: 'TW0051', desc: 'TW0051 Data' },
]

marketRoutes.forEach(route => {
    app.openapi(
        createRoute({
            method: 'get',
            path: route.path,
            tags: ['Market Data'],
            description: route.desc,
            responses: {
                200: {
                    description: route.desc,
                    content: { 'application/json': { schema: z.object({}).passthrough() } }
                }
            }
        }),
        async (c) => {
            const data = await c.env.ANSWERS_BOOK.get(route.key, 'json')
            return c.json({ [route.key]: data })
        }
    )
})

// 8. Answers Original
app.openapi(
    createRoute({
        method: 'get',
        path: '/answersOriginal',
        tags: ['Answer Book'],
        description: 'Get a random answer from the original 350 entries',
        request: {
            query: z.object({
                lang: z.enum(['en', 'zh-TW', '']).optional()
            })
        },
        responses: {
            200: {
                description: 'Random original answer',
                content: { 'application/json': { schema: AnswerSchema } }
            }
        }
    }),
    async (c) => {
        const lang = c.req.query('lang')
        const answer = await getRandomAnswerOriginalFromKV(c.env, lang)
        return c.json({ answer })
    }
)

// 9. Answers With Meta
app.openapi(
    createRoute({
        method: 'get',
        path: '/answersWithMeta',
        tags: ['Answer Book'],
        description: 'Get answer with metadata and filtering',
        request: {
            query: z.object({
                lang: z.string().optional(),
                tone: z.string().optional(),
                mood: z.string().optional(),
                style: z.string().optional(),
                length: z.string().optional(),
                themes: z.string().optional()
            })
        },
        responses: {
            200: {
                description: 'Filtered answer',
                content: { 'application/json': { schema: MetaSchema } }
            }
        }
    }),
    async (c) => {
        const lang = c.req.query('lang') || 'zh-TW'
        const searchParams = new URL(c.req.url).searchParams
        const filters = extractMetaFilters(searchParams)
        try {
            const payload = await getRandomAnswerWithMeta(c.env, lang, filters)
            return c.json(payload)
        } catch (e) {
            return c.json({ success: false, error: e.message }, 500)
        }

    }
)

// 10. Words API
app.openapi(
    createRoute({
        method: 'get',
        path: '/words/categories',
        tags: ['Words Learning'],
        description: 'Get all word categories',
        responses: {
            200: { description: 'Categories list', content: { 'application/json': { schema: SuccessResponseSchema } } }
        }
    }),
    async (c) => {
        return await handleGetCategories(c.env)
    }
)

app.openapi(
    createRoute({
        method: 'get',
        path: '/words/random',
        tags: ['Words Learning'],
        description: 'Get random word from multiple categories',
        request: {
            query: z.object({ categories: z.string().optional() })
        },
        responses: {
            200: { description: 'Random word', content: { 'application/json': { schema: SuccessResponseSchema } } }
        }
    }),
    async (c) => {
        const categories = c.req.query('categories')
        return await handleGetRandomWord(c.env, categories)
    }
)

app.openapi(
    createRoute({
        method: 'get',
        path: '/words/{category}',
        tags: ['Words Learning'],
        description: 'Get random word from category',
        request: {
            params: z.object({ category: z.string() })
        },
        responses: {
            200: { description: 'Random word', content: { 'application/json': { schema: SuccessResponseSchema } } }
        }
    }),
    async (c) => {
        const { category } = c.req.param()
        return await handleGetCategoryRandomWord(c.env, category)
    }
)

app.openapi(
    createRoute({
        method: 'get',
        path: '/words/{category}/{word}',
        tags: ['Words Learning'],
        description: 'Get specific word',
        request: {
            params: z.object({ category: z.string(), word: z.string() })
        },
        responses: {
            200: { description: 'Specific word', content: { 'application/json': { schema: SuccessResponseSchema } } }
        }
    }),
    async (c) => {
        const { category, word } = c.req.param()
        return await handleGetSpecificWord(c.env, category, decodeURIComponent(word))
    }
)

// Legacy /greWord
app.openapi(
    createRoute({
        method: 'get',
        path: '/greWord',
        tags: ['Words Learning'],
        description: 'Legacy GRE word endpoint',
        responses: {
            200: { description: 'GRE word', content: { 'application/json': { schema: z.object({ greWord: z.object({}).passthrough() }) } } }
        }
    }),
    async (c) => {
        const greWord = await getRandomGreWordFromKV(c.env)
        return c.json({ greWord })
    }
)


// --- MCP Route ---
app.post('/mcp', async (c) => {
    const dependencies = {
        getRandomAnswerFromKV,
        getRandomAnswerOriginalFromKV,
        getRandomAnswerWithMeta,
        generateRandomPassword,
        getRandomPoemFromKV,
        getRandomOracleFromKV,
        handleGetCategories,
        handleGetRandomWord,
        handleGetCategoryRandomWord,
        handleGetSpecificWord
    };
    const response = await handleMCPRequest(c.req.raw, c.env, dependencies);
    return c.json(response);
});

// --- Helper Functions (Ported & Updated for Module Syntax) ---

export async function getRandomAnswerFromKV(env, lang) {
    try {
        if (!env.ANSWERS_BOOK) throw new Error('KV binding ANSWERS_BOOK missing')
        const data = await env.ANSWERS_BOOK.get('answersbook', 'json');
        if (!data) throw new Error('KV data is null or undefined');

        const keys = Object.keys(data);
        if (keys.length === 0) throw new Error('No keys found in KV data');

        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const answerData = data[randomKey].answer;

        if (!answerData) throw new Error(`No answer found for key: ${randomKey}`);

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

export async function getRandomAnswerOriginalFromKV(env, lang) {
    try {
        if (!env.ANSWERS_BOOK) throw new Error('KV binding ANSWERS_BOOK missing')
        const data = await env.ANSWERS_BOOK.get('answersbook_original', 'json');
        if (!data) throw new Error('KV data is null or undefined');

        const keys = Object.keys(data);
        if (keys.length === 0) throw new Error('No keys found in KV data');

        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const answerData = data[randomKey].answer;

        if (!answerData) throw new Error(`No answer found for key: ${randomKey}`);

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

export async function getRandomAnswerWithMeta(env, lang, filters) {
    if (!env.ANSWERS_BOOK) throw new Error('KV binding ANSWERS_BOOK missing')
    const data = await env.ANSWERS_BOOK.get('answersbook', 'json');
    if (!data) throw new Error('KV data is null or undefined');

    const entries = Object.entries(data).filter(([, value]) => matchesFilters(value.meta, filters));

    if (entries.length === 0) throw new Error('No answers match the provided filters');

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

// Words API Helpers
export async function handleGetCategories(env) {
    try {
        if (!env.ANSWERS_BOOK) return createErrorResponse('KV binding missing', 500)
        const indexData = await env.ANSWERS_BOOK.get('words_index', 'json');

        if (!indexData || !indexData.categories) {
            return createErrorResponse('Words index not found', 404);
        }

        return createWordsSuccessResponse({
            categories: indexData.categories,
            total: indexData.categories.length,
            totalWords: indexData.totalWords
        });
    } catch (error) {
        return createErrorResponse(error.message, 500);
    }
}

export async function handleGetCategoryRandomWord(env, category) {
    try {
        if (!env.ANSWERS_BOOK) return createErrorResponse('KV binding missing', 500)
        const ndjsonData = await env.ANSWERS_BOOK.get(`words_${category}`, 'text');

        if (!ndjsonData) {
            return createErrorResponse(`Category '${category}' not found`, 404);
        }

        const lines = ndjsonData.trim().split('\n');
        const randomIndex = Math.floor(Math.random() * lines.length);
        const randomWord = JSON.parse(lines[randomIndex]);

        return createWordsSuccessResponse(randomWord);
    } catch (error) {
        return createErrorResponse(error.message, 500);
    }
}

export async function handleGetSpecificWord(env, category, word) {
    try {
        if (!env.ANSWERS_BOOK) return createErrorResponse('KV binding missing', 500)
        const ndjsonData = await env.ANSWERS_BOOK.get(`words_${category}`, 'text');

        if (!ndjsonData) {
            return createErrorResponse(`Category '${category}' not found`, 404);
        }

        const lines = ndjsonData.trim().split('\n');
        const searchWord = word.toLowerCase();

        for (const line of lines) {
            const wordObj = JSON.parse(line);
            if (wordObj.word && wordObj.word.toLowerCase() === searchWord) {
                return createWordsSuccessResponse(wordObj);
            }
        }

        return createErrorResponse(`Word '${word}' not found in category '${category}'`, 404);
    } catch (error) {
        return createErrorResponse(error.message, 500);
    }
}

export async function handleGetRandomWord(env, categoriesParam) {
    try {
        if (!env.ANSWERS_BOOK) return createErrorResponse('KV binding missing', 500)
        const indexData = await env.ANSWERS_BOOK.get('words_index', 'json');

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
        const ndjsonData = await env.ANSWERS_BOOK.get(`words_${randomCategory}`, 'text');

        if (!ndjsonData) {
            return createErrorResponse('Category data not found', 500);
        }

        const lines = ndjsonData.trim().split('\n');
        const randomIndex = Math.floor(Math.random() * lines.length);
        const randomWord = JSON.parse(lines[randomIndex]);

        return createWordsSuccessResponse(randomWord);
    } catch (error) {
        return createErrorResponse(error.message, 500);
    }
}

function createWordsSuccessResponse(data) {
    return new Response(JSON.stringify({
        success: true,
        data: data
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

function createLegacyResponse(data) {
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

function createErrorResponse(message, status = 500) {
    return new Response(JSON.stringify({
        success: false,
        error: message
    }), {
        status: status,
        headers: { 'Content-Type': 'application/json' }
    });
}

async function getRandomGreWordFromKV(env) {
    try {
        if (!env.ANSWERS_BOOK) return { error: 'KV missing' } // Handle gracefully or throw
        const data = await env.ANSWERS_BOOK.get('greWords', 'json');
        if (!data || !data.words) throw new Error('No GRE words found in KV data');
        const randomIndex = Math.floor(Math.random() * data.words.length);
        return data.words[randomIndex];
    } catch (error) {
        console.error('Error fetching random GRE word:', error);
        return `Error: ${error.message}`;
    }
}

export async function getRandomPoemFromKV(env) {
    try {
        if (!env.ANSWERS_BOOK) throw new Error('KV missing')
        const data = await env.ANSWERS_BOOK.get('TangPoetry', 'json');
        if (!data) throw new Error('KV data is null or undefined');
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
    } catch (error) {
        console.error('Error fetching random poem:', error);
        return `Error: ${error.message}`;
    }
}

export async function getRandomOracleFromKV(env) {
    try {
        if (!env.ANSWERS_BOOK) throw new Error('KV missing')
        const data = await env.ANSWERS_BOOK.get('TempleOracleJP', 'json');
        if (!data) throw new Error('KV data is null or undefined');
        const randomIndex = Math.floor(Math.random() * data.length);
        return data[randomIndex];
    } catch (error) {
        console.error('Error fetching random oracle:', error);
        return `Error: ${error.message}`;
    }
}

export function generateRandomPassword() {
    const length = 16;
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const symbols = '-';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    let formattedPassword = '';
    for (let i = 0; i < 4; i++) {
        formattedPassword += password.slice(i * 4, (i + 1) * 4) + (i < 3 ? symbols : '');
    }
    return formattedPassword;
}

app.notFound((c) => {
    return c.json({ success: false, error: 'Not Found' }, 404)
})

export default app
