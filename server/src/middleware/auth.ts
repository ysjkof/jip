import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger.js';

export const authenticateApiKey = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    const validApiKey = process.env.API_KEY;

    if (!validApiKey) {
        logger.error('API_KEY environment variable is not set.');
        return res.status(500).json({ error: 'Server configuration error' });
    }

    if (!apiKey || apiKey !== validApiKey) {
        logger.warn(`Unauthorized access attempt from ${req.ip}`);
        return res.status(401).json({ error: 'Unauthorized' });
    }

    next();
};
