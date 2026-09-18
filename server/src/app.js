import express from 'express';
import cors from 'cors';
import { dbMode } from './data/index.js';
import { dbDiagnostics } from './config/db.js';
import publicRoutes from './routes/public.js';
import volunteerRoutes from './routes/volunteers.js';
import enquiryRoutes from './routes/enquiries.js';
import adminRoutes from './routes/admin.js';
import postRoutes from './routes/posts.js';
import cronRoutes from './routes/cron.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', db: dbMode(), database: dbDiagnostics() });
  });

  app.use('/api', publicRoutes);
  app.use('/api', volunteerRoutes);
  app.use('/api', enquiryRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api', postRoutes);
  app.use('/api', cronRoutes);

  app.use((_req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, _req, res, _next) => {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  });

  return app;
}