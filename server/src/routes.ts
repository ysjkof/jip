import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { runScrapeJob } from './services/cron.js';

export const router = Router();
const prisma = new PrismaClient();

router.post('/crawl', async (req: Request, res: Response) => {
    try {
        // Run the scrape job asynchronously (fire and forget from client perspective, or await?)
        // User probably wants to know when it's done if they call it manually.
        await runScrapeJob();
        res.json({ message: 'Crawl completed successfully' });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});



router.get('/data', async (req: Request, res: Response) => {
    try {
        const users = await prisma.user.findMany();
        const patients = await prisma.patient.findMany();
        const prices = await prisma.price.findMany();
        res.json({ users, patients, prices });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
});
