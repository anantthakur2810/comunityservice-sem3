import mongoose from 'mongoose';

const READY_STATES = ['disconnected', 'connected', 'connecting', 'disconnecting'];

const diag = {
  uriConfigured: false,
  lastAttemptAt: null,
  lastError: null,
};

/**
 * Strip connection strings and credentials before an error message is exposed,
 * because `/api/health` is a public endpoint.
 */
function redact(value) {
  if (!value) return null;
  return String(value)
    .replace(/mongodb(\+srv)?:\/\/\S+/gi, 'mongodb://***')
    .replace(/\/\/[^:@\s/]+:[^@\s/]+@/g, '//***:***@')
    .slice(0, 300);
}

/** Record a database failure so it can be reported by `/api/health`. */
export function noteDbError(err) {
  diag.lastError = redact(err && (err.message || err));
}

export async function connectDB() {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dps_ngo';
  diag.uriConfigured = Boolean(process.env.MONGODB_URI);
  diag.lastAttemptAt = new Date().toISOString();
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    diag.lastError = null;
    console.log('✅ MongoDB connected');
    return true;
  } catch (err) {
    noteDbError(err);
    console.warn(`⚠️  MongoDB not reachable (${err.message})`);
    console.warn('   Running in DEMO mode with in-memory data. Set MONGODB_URI to use a real database.');
    return false;
  }
}

/**
 * Non-sensitive connection diagnostics for `/api/health`. Distinguishes
 * "no MONGODB_URI at all" from "URI set but the connection failed", which
 * otherwise both look like `db: "demo"`.
 */
export function dbDiagnostics() {
  const readyState = mongoose.connection.readyState;
  return {
    uriConfigured: diag.uriConfigured,
    readyState,
    state: READY_STATES[readyState] || 'unknown',
    lastAttemptAt: diag.lastAttemptAt,
    lastError: diag.lastError,
  };
}
