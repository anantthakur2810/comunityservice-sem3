import { Router } from 'express';
import { data } from '../data/index.js';
import { requireAdmin } from '../auth.js';
import {
  parsePostUrl,
  youtubeThumb,
  fetchYouTubeMeta,
  syncChannelVideos,
  DEFAULT_CHANNEL_ID,
} from '../services/posts.js';

const router = Router();

/* --------------------------------- public --------------------------------- */

router.get('/posts', async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 24, 50);
    const posts = await data().listPosts({ limit });
    res.json({ posts });
  } catch (err) {
    next(err);
  }
});

/* --------------------------------- admin ---------------------------------- */

router.use('/admin', requireAdmin);

// Full list for the admin panel (includes everything, newest first).
router.get('/admin/posts', async (req, res, next) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const posts = await data().listPosts({ limit });
    res.json({ posts });
  } catch (err) {
    next(err);
  }
});

// Preview any supported post URL (YouTube / Instagram) before saving.
router.post('/admin/posts/preview', async (req, res, next) => {
  try {
    const { url } = req.body || {};
    const parsed = parsePostUrl(url);
    if (!parsed) {
      return res.status(400).json({
        error: 'Unsupported link. Paste a YouTube video/short or Instagram reel/post URL.',
      });
    }
    let meta = null;
    if (parsed.platform === 'youtube') {
      meta = await fetchYouTubeMeta(parsed.externalId);
    }
    res.json({
      preview: {
        ...parsed,
        title: (meta && meta.title) || '',
        author: (meta && meta.author) || '',
        thumbnailUrl:
          parsed.platform === 'youtube' ? youtubeThumb(parsed.externalId) : '',
      },
    });
  } catch (err) {
    next(err);
  }
});

router.post('/admin/posts', async (req, res, next) => {
  try {
    const { url, caption } = req.body || {};
    const parsed = parsePostUrl(url);
    if (!parsed) {
      return res.status(400).json({
        error: 'Unsupported link. Paste a YouTube video/short or Instagram reel/post URL.',
      });
    }
    let meta = null;
    if (parsed.platform === 'youtube') {
      meta = await fetchYouTubeMeta(parsed.externalId);
    }
    const post = await data().createPost({
      url: parsed.canonicalUrl,
      platform: parsed.platform,
      kind: parsed.kind,
      externalId: parsed.externalId,
      title: (meta && meta.title) || caption || '',
      caption: caption || '',
      thumbnailUrl: parsed.platform === 'youtube' ? youtubeThumb(parsed.externalId) : '',
      source: 'manual',
    });
    res.status(201).json({ post });
  } catch (err) {
    next(err);
  }
});

router.delete('/admin/posts/:id', async (req, res, next) => {
  try {
    const removed = await data().removePost(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Post not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// Pull the latest public YouTube videos into the site (used by the button and cron).
router.post('/admin/posts/sync', async (req, res, next) => {
  try {
    const channelId = (req.body && req.body.channelId) || DEFAULT_CHANNEL_ID;
    const added = await syncChannelVideos(data(), channelId);
    const posts = await data().listPosts({ limit: 50 });
    res.json({ added, total: posts.length });
  } catch (err) {
    next(err);
  }
});

export default router;
