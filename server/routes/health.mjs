import { z } from 'zod';

export default (
    /** @type {import('express').Router} */ router,
    /** @type {import('@asteasolutions/zod-to-openapi').OpenAPIRegistry?} */ registry) => {
    registry?.registerPath({
        method: 'get',
        path: '/health',
        description: 'Returns a greeting message',
        summary: 'Returns a greeting message',
        responses: {
            200: {
                description: 'A successful response',
                content: {
                    'text/plain': {
                        schema: z.string().openapi({ example: 'Hello World!' }),
                    },
                },
            },
        },
    });
    router.get('/health', (req, res) => {
        res.send('Hello World!');
    });
}