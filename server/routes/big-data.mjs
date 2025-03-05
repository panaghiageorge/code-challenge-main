import { z } from 'zod';
import { DATA } from '../data/char-count.mjs';

const schema = z.object({
    fields: z.string().array().optional(),
}).openapi('CharFields', { example: { fields: ['A', 'B', 'C'] } });

const charFrequencySchema = z.record(z.array(z.number())).openapi('CharFrequency', {
    example: {
        'A': [1, 2, 3],
        'B': [4, 5, 6],
        'C': [7, 8, 9],
    }
})

export default (
    /** @type {import('express').Router} */ router,
    /** @type {import('@asteasolutions/zod-to-openapi').OpenAPIRegistry?} */ registry) => {
    registry?.registerPath({
        method: 'post',
        path: '/big-data',
        description: 'Retrieve big data',
        summary: 'Retrieve big data',
        request: {
            body: {
                content: {
                    'application/json': {
                        schema: schema,
                    },
                },
                description: 'Fields to retrieve',
                required: false,
            },
        },
        responses: {
            200: {
                description: 'Successfully retrieved data',
                content: {
                    'application/json': {
                        schema: charFrequencySchema,
                    },
                },
            },
            400: {
                description: 'Invalid request',
                content: {
                    'application/json': {
                        schema: z.object({
                            fields: z.string().optional(),
                        }),
                    },
                },
            },
        }
    })
    router.post('/big-data', (req, res) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json(result.error.flatten().fieldErrors);
        }

        const { fields } = result.data;
        if (!fields || fields.length === 0) {
            return res.json(DATA);
        }

        const invalidFields = fields.filter(option => !DATA.hasOwnProperty(option));
        if (invalidFields.length > 0) {
            return res.status(400).json({ error: `Invalid fields: ${invalidFields.join(', ')}` });
        }

        const response = fields.reduce((acc, option) => {
            acc[option] = DATA[option];
            return acc;
        }, {});

        res.json(response);
    });

    registry?.registerPath({
        method: 'get',
        path: '/big-data/fields',
        description: 'Get available data fields',
        summary: 'Get available data fields',
        responses: {
            200: {
                description: 'Successfully retrieved data fields',
                content: {
                    'application/json': {
                        schema: z.array(z.string()),
                    },
                },
            },
        },
    });
    router.get('/big-data/fields', (req, res) => {
        res.json(Object.keys(DATA));
    });
};
