import { Router } from 'express';
import { data } from '../data/index.js';

const router = Router();

router.get('/requirements', async (_req, res, next) => {
  try {
    res.json({ requirements: await data().listRequirements() });
  } catch (err) {
    next(err);
  }
});

router.get('/stats', async (_req, res, next) => {
  try {
    res.json({ stats: await data().stats() });
  } catch (err) {
    next(err);
  }
});

export default router;