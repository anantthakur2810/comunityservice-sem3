import 'dotenv/config';
import { createApp } from './app.js';
import { bootstrapData } from './bootstrap.js';

// Some environments export PORT=0 meaning "unset" — fall back to 5000.
const PORT = Number(process.env.PORT) || 5000;

const connected = await bootstrapData();

const app = createApp();
app.listen(PORT, () => {
  console.log(`🚀 DPS Shiksha Samiti API running on http://localhost:${PORT}`);
  console.log(`   Data mode: ${connected ? 'MongoDB' : 'demo (in-memory)'}`);
  console.log(`   Admin password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
});
