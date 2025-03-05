import request from 'supertest';
import express from 'express';
import bigDataRoute from './big-data.mjs';
import { DATA } from '../data/char-count.mjs';

const app = express();
app.use(express.json());
bigDataRoute(app);

describe('POST /big-data', () => {
    it('should return all data when no fields are provided', async () => {
        const response = await request(app).post('/big-data').send({});
        expect(response.status).toBe(200);
        expect(response.body).toEqual(DATA);
    });

    it('should return filtered data based on provided fields', async () => {
        const fields = Object.keys(DATA).slice(0, 2);
        const response = await request(app).post('/big-data').send({ fields });
        expect(response.status).toBe(200);
        expect(response.body).toEqual(expect.objectContaining({ [fields[0]]: DATA[fields[0]], [fields[1]]: DATA[fields[1]] }));
    });

    it('should return 400 for invalid fields', async () => {
        const response = await request(app).post('/big-data').send({ fields: ['invalidField'] });
        expect(response.status).toBe(400);
        expect(response.body.error).toMatch(/Invalid fields/);
    });

    it('should return 400 for invalid request body', async () => {
        const response = await request(app).post('/big-data').send({ fields: 'invalid' });
        expect(response.status).toBe(400);
    });
});

describe('GET /big-data/fields', () => {
    it('should return a list of available data fields', async () => {
        const response = await request(app).get('/big-data/fields');
        expect(response.status).toBe(200);
        expect(response.body).toEqual(Object.keys(DATA));
    });
});