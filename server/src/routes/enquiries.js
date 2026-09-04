import { Router } from 'express';
import { data } from '../data/index.js';

const router = Router();

const ENQUIRY_TYPES = ['donation', 'support', 'partnership', 'other'];

router.post('/enquiries', async (req, res, next) => {
  try {
    const { name, email, phone, type, amount, message } = req.body || {};
    if (!name || !name.trim()) {
      return res.status(400).json({ error: 'Name is required' });
    }
    if (!email || !email.trim() || !email.includes('@')) {
      return res.status(400).json({ error: 'A valid email is required' });
    }
    const enquiryType = ENQUIRY_TYPES.includes(type) ? type : 'other';
    const enquiry = await data().createEnquiry({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: (phone || '').trim(),
      type: enquiryType,
      amount: (amount || '').trim(),
      message: (message || '').trim(),
    });
    res.status(201).json({ enquiry });
  } catch (err) {
    next(err);
  }
});

export default router;