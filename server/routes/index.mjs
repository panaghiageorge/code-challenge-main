import express from 'express';
import fs from 'fs';
import chalk from 'chalk';
import { registry } from '../utils/openApiDefinition.mjs';

export const router = express.Router();

const routes = fs.readdirSync(import.meta.dirname, { withFileTypes: true });

for (const file of routes) {
    if (file.name === 'index.mjs') continue;
    if (file.name.includes('test')) continue;
    try {
        const module = await import(`./${file.name}`);
        module.default(router, registry);
        console.log('Loaded route: ' + chalk.green(file.name));
    } catch (err) {
        console.error('Failed to load route: ' + chalk.red(file.name));
        console.error(err);
    }
}
