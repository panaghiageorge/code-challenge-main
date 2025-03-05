import request from 'supertest';
import express from 'express';
import slowSearchRoute from './slow-search.mjs';

const app = express();
slowSearchRoute(app);

describe('GET /slow-search', () => {
    it('should return all country names when no search query is provided', async () => {
        const response = await request(app).get('/slow-search').expect(200);
        expect(response.body.length).toBeGreaterThan(0);
    });

    it('should return filtered country names based on search query', async () => {
        const response = await request(app).get('/slow-search').query({ search: 'United' }).expect(200);
        expect(response.body).toEqual(expect.arrayContaining(['United States', 'United Kingdom']));
    });
});