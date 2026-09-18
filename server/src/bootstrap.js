import { connectDB } from './config/db.js';
import Requirement from './models/Requirement.js';
import Activity from './models/Activity.js';
import { seedRequirements, seedActivities } from './seed-data.js';

/**
 * Optional starter content. Auto-seeding is DISABLED — the NGO now manages all
 * requirements and activities through the admin panel, and demo data would
 * come back on every fresh database. Kept for the manual seed script:
 *   npm run seed --prefix server
 */
export async function seedStarterContent() {
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
 * Connects to MongoDB (when a URI is configured).
 *
 * Returns `true` when MongoDB is in use, `false` when the server is running in
 * DEMO mode on the in-memory store. Starter content is NOT seeded
 * automatically — the NGO creates real content through the admin panel.
 */
export async function bootstrapData() {
  return connectDB();
}
