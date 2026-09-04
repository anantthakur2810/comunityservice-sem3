import 'dotenv/config';
import { connectDB } from './config/db.js';
import Requirement from './models/Requirement.js';
import Activity from './models/Activity.js';
import { seedRequirements, seedActivities } from './seed-data.js';

const connected = await connectDB();
if (!connected) {
  console.error('MongoDB is not available — nothing to seed. Start a MongoDB instance and retry.');
  process.exit(1);
}

await Requirement.deleteMany({});
await Activity.deleteMany({});
await Requirement.insertMany(seedRequirements);
await Activity.insertMany(seedActivities);
console.log('✅ Seeded requirements and activities');
process.exit(0);