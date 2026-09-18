import { connectDB } from './config/db.js';

/**
 * Connects to MongoDB (when a URI is configured).
 *
 * Returns `true` when MongoDB is in use, `false` when the server is running in
 * DEMO mode on the in-memory store. No starter content is seeded — the NGO
 * creates real content through the admin panel.
 */
export async function bootstrapData() {
  return connectDB();
}
