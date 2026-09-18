import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './config/db.js';
import { bootstrapData } from './bootstrap.js';
import { data } from './data/index.js';
import { syncChannelVideos, DEFAULT_CHANNEL_ID } from './services/posts.js';

const connected = await bootstrapData();
if (!connected) {
  console.error('MongoDB is not available — nothing to seed. Start a MongoDB instance and retry.');
  process.exit(1);
}

await Requirement.deleteMany({});
await Activity.deleteMany({});
await Requirement.insertMany(seedRequirements);
await Activity.insertMany(seedActivities);
console.log('✅ Seeded requirements and activities');

// Pull the NGO's latest YouTube videos into the posts collection.
try {
  const added = await syncChannelVideos(data(), process.env.YOUTUBE_CHANNEL_ID || DEFAULT_CHANNEL_ID);
  console.log(`✅ Synced ${added} new YouTube video(s) into posts`);
} catch (err) {
  console.warn(`⚠️  YouTube sync failed: ${err.message}`);
}

await mongoose.disconnect();
process.exit(0);