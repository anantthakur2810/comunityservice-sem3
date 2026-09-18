/**
 * Vercel serverless entry point.
 *
 * Vercel runs files inside `api/` as functions. This one mounts the whole
 * Express app, so every `/api/*` request is handled by the same router that
 * `server/src/index.js` serves during local development.
 *
 * The repo root is CommonJS and the server is ESM, so the server modules are
 * pulled in with dynamic `import()` and cached for the lifetime of the
 * serverless instance.
 */
let appPromise;

async function getApp() {
  if (!appPromise) {
    appPromise = (async () => {
      const [{ createApp }, { bootstrapData }] = await Promise.all([
        import('../server/src/app.js'),
        import('../server/src/bootstrap.js'),
      ]);

      // Connect + seed once per instance. Skipped when MONGODB_URI is unset so
      // cold starts don't wait on an unreachable socket — the API then serves
      // the in-memory demo store (data resets on every deploy/instance).
      if (process.env.MONGODB_URI) {
        try {
          await bootstrapData();
        } catch (err) {
          console.error('[api] database init failed, using demo data:', err.message);
        }
      }

      return createApp();
    })();
  }
  return appPromise;
}

module.exports = async function handler(req, res) {
  const app = await getApp();

  // Vercel may have already parsed the JSON body. body-parser skips requests
  // flagged with `_body`, so mark it and the payload survives for our routes.
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    req._body = true;
  }

  return app(req, res);
};
