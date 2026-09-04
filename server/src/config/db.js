import mongoose from 'mongoose';

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dps_ngo';
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ MongoDB connected');
    return true;
  } catch (err) {
    console.warn(`⚠️  MongoDB not reachable (${err.message})`);
    console.warn('   Running in DEMO mode with in-memory data. Set MONGODB_URI to use a real database.');
    return false;
  }
}