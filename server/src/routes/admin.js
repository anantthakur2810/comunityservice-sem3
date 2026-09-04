import { Router } from 'express';
import { createHash, timingSafeEqual } from 'node:crypto';
import { adminToken, adminPassword, requireAdmin } from '../auth.js';
import { data } from '../data/index.js';

const router = Router();

router.post('/login', (req, res) => {
  const { password } = req.body || {};
  const expected = adminPassword();
  if (
    !password ||
    password.length !== expected.length ||
    !timingSafeEqual(Buffer.from(password), Buffer.from(expected))
  ) {
    return res.status(401).json({ error: 'Invalid password' });
  }
  res.json({ token: adminToken() });
});

// Everything below requires a valid admin token.
router.use(requireAdmin);

/* -------------------------------- volunteers ------------------------------- */
router.get('/volunteers', async (_req, res, next) => {
  try {
    res.json({ volunteers: await data().listVolunteers() });
  } catch (err) {
    next(err);
  }
});

router.delete('/volunteers/:id', async (req, res, next) => {
  try {
    const removed = await data().removeVolunteer(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Volunteer not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/* -------------------------------- enquiries -------------------------------- */
router.get('/enquiries', async (_req, res, next) => {
  try {
    res.json({ enquiries: await data().listEnquiries() });
  } catch (err) {
    next(err);
  }
});

router.patch('/enquiries/:id', async (req, res, next) => {
  try {
    const { status } = req.body || {};
    if (!['new', 'contacted', 'resolved'].includes(status)) {
      return res.status(400).json({ error: 'Status must be new, contacted or resolved' });
    }
    const enquiry = await data().updateEnquiry(req.params.id, { status });
    if (!enquiry) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ enquiry });
  } catch (err) {
    next(err);
  }
});

router.delete('/enquiries/:id', async (req, res, next) => {
  try {
    const removed = await data().removeEnquiry(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Enquiry not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/* ------------------------------- requirements ------------------------------ */
router.get('/requirements', async (_req, res, next) => {
  try {
    res.json({ requirements: await data().listRequirements() });
  } catch (err) {
    next(err);
  }
});

router.post('/requirements', async (req, res, next) => {
  try {
    const { title, description, category } = req.body || {};
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const requirement = await data().createRequirement({
      title: title.trim(),
      description: (description || '').trim(),
      category: (category || '').trim(),
    });
    res.status(201).json({ requirement });
  } catch (err) {
    next(err);
  }
});

router.patch('/requirements/:id', async (req, res, next) => {
  try {
    const { title, description, category } = req.body || {};
    const patch = {};
    if (title !== undefined) patch.title = title.trim();
    if (description !== undefined) patch.description = description.trim();
    if (category !== undefined) patch.category = category.trim();
    const requirement = await data().updateRequirement(req.params.id, patch);
    if (!requirement) return res.status(404).json({ error: 'Requirement not found' });
    res.json({ requirement });
  } catch (err) {
    next(err);
  }
});

router.delete('/requirements/:id', async (req, res, next) => {
  try {
    const removed = await data().removeRequirement(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Requirement not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

/* -------------------------------- activities ------------------------------- */
router.get('/activities', async (_req, res, next) => {
  try {
    res.json({ activities: await data().listActivities() });
  } catch (err) {
    next(err);
  }
});

router.post('/activities', async (req, res, next) => {
  try {
    const { title, description, date } = req.body || {};
    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Title is required' });
    }
    const activity = await data().createActivity({
      title: title.trim(),
      description: (description || '').trim(),
      date: (date || '').trim(),
    });
    res.status(201).json({ activity });
  } catch (err) {
    next(err);
  }
});

router.patch('/activities/:id', async (req, res, next) => {
  try {
    const { title, description, date } = req.body || {};
    const patch = {};
    if (title !== undefined) patch.title = title.trim();
    if (description !== undefined) patch.description = description.trim();
    if (date !== undefined) patch.date = date.trim();
    const activity = await data().updateActivity(req.params.id, patch);
    if (!activity) return res.status(404).json({ error: 'Activity not found' });
    res.json({ activity });
  } catch (err) {
    next(err);
  }
});

router.delete('/activities/:id', async (req, res, next) => {
  try {
    const removed = await data().removeActivity(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Activity not found' });
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;