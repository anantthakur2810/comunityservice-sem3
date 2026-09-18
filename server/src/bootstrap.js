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

/**
 * Connects to MongoDB (when a URI is configured) and seeds the starter
 * requirements/activities if the collections are empty.
 *
 * Returns `true` when MongoDB is in use, `false` when the server is running in
 * DEMO mode on the in-memory store.
 */
export async function bootstrapData() {
  const connected = await connectDB();
  if (connected) await autoSeed();
  return connected;
}
