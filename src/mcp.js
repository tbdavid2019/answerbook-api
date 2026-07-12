
export const tools = [
    {
        name: 'get_answer',
        description: 'Get a random answer from the primary "Book of Answers" database.',
        inputSchema: {
            type: 'object',
            properties: {
                lang: { type: 'string', description: 'Language code (en or zh-TW)' }
            }
        }
    },
    {
        name: 'get_original_answer',
        description: 'Get a random answer from the original 350 "Book of Answers" entries.',
        inputSchema: {
            type: 'object',
            properties: {
                lang: { type: 'string', description: 'Language code (en or zh-TW)' }
            }
        }
    },
    {
        name: 'get_answer_with_meta',
        description: 'Get a random answer with specific metadata filters.',
        inputSchema: {
            type: 'object',
            properties: {
                lang: { type: 'string', description: 'Language code (default: zh-TW)' },
                tone: { type: 'string' },
                mood: { type: 'string' },
                style: { type: 'string' },
                length: { type: 'string' },
                themes: { type: 'string', description: 'Comma-separated list of themes' }
            }
        }
    },
    {
        name: 'generate_password',
        description: 'Generate a secure 16-character random password.',
        inputSchema: { type: 'object', properties: {} }
    },
    {
        name: 'get_tang_poetry',
        description: 'Get a random Tang dynasty poem.',
        inputSchema: { type: 'object', properties: {} }
    },
    {
        name: 'get_stray_birds',
        description: 'Get a random poem from Stray Birds by Rabindranath Tagore.',
        inputSchema: { type: 'object', properties: {} }
    },
    {
        name: 'get_temple_oracle',
        description: 'Get a random Japanese Temple Oracle (Omikuji).',
        inputSchema: { type: 'object', properties: {} }
    },
    {
        name: 'get_market_data',
        description: 'Get the latest market data for a specific index.',
        inputSchema: {
            type: 'object',
            properties: {
                index: { 
                    type: 'string', 
                    enum: ['SP500', 'nasdaq100', 'dowjones', 'TW0050', 'TW0051'],
                    description: 'The market index to fetch data for'
                }
            },
            required: ['index']
        }
    },
    {
        name: 'get_word_categories',
        description: 'List all available vocabulary learning categories.',
        inputSchema: { type: 'object', properties: {} }
    },
    {
        name: 'get_random_word',
        description: 'Get a random vocabulary word, optionally filtered by categories.',
        inputSchema: {
            type: 'object',
            properties: {
                categories: { type: 'string', description: 'Comma-separated list of category IDs' },
                category: { type: 'string', description: 'Specific category ID' }
            }
        }
    },
    {
        name: 'get_specific_word',
        description: 'Get detailed information for a specific vocabulary word.',
        inputSchema: {
            type: 'object',
            properties: {
                category: { type: 'string', description: 'Category ID' },
                word: { type: 'string', description: 'The word to look up' }
            },
            required: ['category', 'word']
        }
    }
];

export async function handleMCPRequest(request, env, dependencies) {
    const { 
        getRandomAnswerFromKV, 
        getRandomAnswerOriginalFromKV, 
        getRandomAnswerWithMeta,
        generateRandomPassword,
        getRandomPoemFromKV,
        getRandomOracleFromKV,
        getRandomStrayBirdsFromKV,
        handleGetCategories,
        handleGetRandomWord,
        handleGetCategoryRandomWord,
        handleGetSpecificWord
    } = dependencies;

    const body = await request.json();
    const { method, params, id } = body;

    if (method === 'tools/list') {
        return {
            jsonrpc: '2.0',
            id,
            result: { tools }
        };
    }

    if (method === 'tools/call') {
        const { name, arguments: args } = params;
        let result;

        try {
            switch (name) {
                case 'get_answer':
                    result = await getRandomAnswerFromKV(env, args.lang);
                    break;
                case 'get_original_answer':
                    result = await getRandomAnswerOriginalFromKV(env, args.lang);
                    break;
                case 'get_answer_with_meta':
                    result = await getRandomAnswerWithMeta(env, args.lang || 'zh-TW', args);
                    break;
                case 'generate_password':
                    result = generateRandomPassword();
                    break;
                case 'get_tang_poetry':
                    result = await getRandomPoemFromKV(env);
                    break;
                case 'get_stray_birds':
                    result = await getRandomStrayBirdsFromKV(env);
                    break;
                case 'get_temple_oracle':
                    result = await getRandomOracleFromKV(env);
                    break;
                case 'get_market_data':
                    result = await env.ANSWERS_BOOK.get(args.index, 'json');
                    break;
                case 'get_word_categories':
                    const catRes = await handleGetCategories(env);
                    result = await catRes.json();
                    break;
                case 'get_random_word':
                    let wordRes;
                    if (args.category) {
                        wordRes = await handleGetCategoryRandomWord(env, args.category);
                    } else {
                        wordRes = await handleGetRandomWord(env, args.categories);
                    }
                    result = await wordRes.json();
                    break;
                case 'get_specific_word':
                    const specRes = await handleGetSpecificWord(env, args.category, args.word);
                    result = await specRes.json();
                    break;
                default:
                    return {
                        jsonrpc: '2.0',
                        id,
                        error: { code: -32601, message: `Tool not found: ${name}` }
                    };
            }

            return {
                jsonrpc: '2.0',
                id,
                result: {
                    content: [
                        {
                            type: 'text',
                            text: typeof result === 'string' ? result : JSON.stringify(result, null, 2)
                        }
                    ]
                }
            };
        } catch (error) {
            return {
                jsonrpc: '2.0',
                id,
                error: { code: -32603, message: error.message }
            };
        }
    }

    return {
        jsonrpc: '2.0',
        id,
        error: { code: -32601, message: `Method not found: ${method}` }
    };
}
