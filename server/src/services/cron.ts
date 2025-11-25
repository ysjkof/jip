import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';
import { loginAndScrape } from './scraper.js';
import { logger } from '../logger.js';
import { TherapyType } from '../types.js';

const prisma = new PrismaClient();

export const runScrapeJob = async () => {
    logger.info('Starting scraping job...');
    
    try {
      const id = process.env.USER_ID;
      const password = process.env.USER_PASSWORD;
      
      if (!id || !password) {
        logger.error('Missing USER_ID or USER_PASSWORD environment variables. Skipping job.');
        return;
      }

      logger.info(`Starting scrape for user: ${id}.`);
      
      const types = ['dosu', 'eswt'];

      for (const type of types) {
        logger.info(`Processing scrape for type: ${type}`);
        
        try {
            const data = await loginAndScrape(id, password, type as TherapyType);
            
            // Save Users
            for (const user of data.userList.users) {
                await prisma.user.upsert({
                    where: { key: user.key },
                    update: { name: user.name },
                    create: { key: user.key, name: user.name }
                });
            }

            // Save Patients
            const existingPatients = await prisma.patient.findMany({
                select: { chartNumber: true, name: true }
            });
            const existingPatientSet = new Set(existingPatients.map(p => `${p.chartNumber}-${p.name}`));
            
            const newPatients = data.patientListAndPrices.patients
                .filter(p => !existingPatientSet.has(`${p.chartNumber}-${p.name}`))
                .map(p => ({
                    chartNumber: p.chartNumber,
                    name: p.name
                }));

            if (newPatients.length > 0) {
                await prisma.patient.createMany({
                    data: newPatients
                });
            }

            // Save Prices
            const existingPrices = await prisma.price.findMany({
                where: { type: type },
                select: { value: true }
            });
            const existingPriceSet = new Set(existingPrices.map(p => p.value));

            const newPrices = data.patientListAndPrices.prices
                .filter(p => !existingPriceSet.has(p))
                .map(p => ({
                    value: p,
                    type: type
                }));

            if (newPrices.length > 0) {
                await prisma.price.createMany({
                    data: newPrices
                });
            }

            // Save Session
            await prisma.session.create({ data: { cookie: data.cookie } });
            
            logger.info(`Successfully scraped data for ${type}`);
        } catch (error: any) {
            logger.error(`Failed to scrape for ${type}: ${error.message}`);
        }
      }
      
      logger.info('Scraping job completed.');
    } catch (error: any) {
      logger.error(`Job failed: ${error.message}`);
    }
};

export const startCronJobs = () => {
  // Run at 8:20 AM, Monday through Saturday
  cron.schedule('20 8 * * 1-6', () => {
    runScrapeJob();
  });
  
  logger.info('Cron jobs initialized (running at 8:20 AM, Mon-Sat).');
};
