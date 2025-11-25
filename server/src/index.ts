import express from 'express';
import cors from 'cors';
import { router } from './routes.js';
import { startCronJobs, runScrapeJob } from './services/cron.js';
import { logger } from './logger.js';

import { authenticateApiKey } from './middleware/auth.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Apply authentication middleware globally
app.use(authenticateApiKey);

app.use('/', router);

app.listen(PORT, () => {
  logger.info(`Server is running on http://localhost:${PORT}`);
  runScrapeJob();
  startCronJobs();
});
