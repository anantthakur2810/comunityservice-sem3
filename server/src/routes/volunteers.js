import { Router } from 'express';
import { data } from '../data/index.js';

const router = Router();

router.post('/volunteers', async (req, res, next) => {
  try {
    const { name, email, phone, skills, availability, message } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    const volunteer = await data().createVolunteer({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      skills: (skills || '').trim(),
      availability: (availability || '').trim(),
      message: (message || '').trim(),
    });
    res.status(201).json({ volunteer });
  } catch (err) {
    next(err);
  }
});

export default router;