import { Router } from 'express';
import { data } from '../data/index.js';
import { syncChannelVideos, DEFAULT_CHANNEL_ID } from '../services/posts.js';

const router = Router();

/**
 * Called daily by the Vercel cron defined in vercel.json. Protected by
 * CRON_SECRET when it is set (Vercel sends it as `Authorization: Bearer <secret>`).
 * When CRON_SECRET is not configured the endpoint stays open but can only add
 * public YouTube videos to the posts list.
 */
router.get('/cron/sync-posts', async (req, res, next) => {
  try {
    const secret = process.env.CRON_SECRET;
    if (secret) {
      const header = req.headers.authorization || '';
      if (header !== `Bearer ${secret}`) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
    }
    const added = await syncChannelVideos(data(), process.env.YOUTUBE_CHANNEL_ID || DEFAULT_CHANNEL_ID);
    res.json({ ok: true, added });
  } catch (err) {
    next(err);
  }
});

export default router;
