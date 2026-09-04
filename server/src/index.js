import 'dotenv/config';
import { createApp } from './app.js';
import { connectDB } from './config/db.js';
import Requirement from './models/Requirement.js';
import Activity from './models/Activity.js';
import { seedRequirements, seedActivities } from './seed-data.js';

async function autoSeed() {
  const [reqCount, actCount] = await Promise.all([
    Requirement.countDocuments(),
    Activity.countDocuments(),
  ]);
  if (reqCount === 0) await Requirement.insertMany(seedRequirements);
  if (actCount === 0) await Activity.insertMany(seedActivities);
  if (reqCount === 0 || actCount === 0) {
    console.log('🌱 Seeded initial requirements and activities');
  }
}

// Some environments export PORT=0 meaning "unset" — fall back to 5000.
const PORT = Number(process.env.PORT) || 5000;

const connected = await connectDB();
if (connected) await autoSeed();

const app = createApp();
app.listen(PORT, () => {
  console.log(`🚀 DPS Shiksha Samiti API running on http://localhost:${PORT}`);
  console.log(`   Data mode: ${connected ? 'MongoDB' : 'demo (in-memory)'}`);
  console.log(`   Admin password: ${process.env.ADMIN_PASSWORD || 'admin123'}`);
});