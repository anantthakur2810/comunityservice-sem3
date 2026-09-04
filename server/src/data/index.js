import mongoose from 'mongoose';
import createMemoryStore from './memory.js';
import createMongoStore from './mongo.js';

let memory = null;

/**
 * Returns the active data store. Uses MongoDB when the connection is up,
 * otherwise falls back to an in-memory store so the API keeps working
 * without a database (DEMO mode).
 */
export function data() {
  if (mongoose.connection.readyState === 1) {
    return createMongoStore();
  }
  if (!memory) memory = createMemoryStore();
  return memory;
}

/** 'connected' when MongoDB is in use, 'demo' otherwise. */
export function dbMode() {
  return mongoose.connection.readyState === 1 ? 'connected' : 'demo';
}