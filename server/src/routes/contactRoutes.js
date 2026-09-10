import { Router } from 'express';
import Contact from '../models/Contact.js';

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, company = '', message } = req.body ?? {};
    const values = { name, email, phone, company, message };
    const missing = ['name', 'email', 'phone', 'message'].filter((field) => !String(values[field] ?? '').trim());

    if (missing.length > 0) return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}.` });
    if (!emailPattern.test(String(email).trim())) return res.status(400).json({ message: 'Please provide a valid email address.' });

    const enquiry = await Contact.create(values);
    return res.status(201).json({ message: 'Enquiry received.', id: enquiry.id });
  } catch (error) {
    if (error.name === 'ValidationError') return res.status(400).json({ message: 'Please check the details and try again.' });
    return next(error);
  }
});

export default router;
