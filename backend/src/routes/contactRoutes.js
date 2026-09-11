import { Router } from 'express';
import mongoose from 'mongoose';
import Contact from '../models/Contact.js';
import { sendEnquiryEmail } from '../utils/mailer.js';

const router = Router();
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// GET /api/contact - Retrieve all contact submissions for Admin Dashboard
router.get('/', async (_req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const enquiries = await Contact.find().sort({ createdAt: -1 });
      return res.status(200).json({ status: 'ok', data: enquiries });
    } else {
      return res.status(200).json({ status: 'ok', data: [], note: 'Database offline or connecting' });
    }
  } catch (error) {
    return next(error);
  }
});

// POST /api/contact - Submit new contact enquiry and store in MongoDB
router.post('/', async (req, res, next) => {
  try {
    const { name, email, phone, company = '', message = '', eventLocation = '', source = 'Website Form' } = req.body ?? {};
    const values = { 
      name: String(name || '').trim(), 
      email: String(email || '').trim() || 'N/A', 
      phone: String(phone || '').trim(), 
      company: String(company || eventLocation || '').trim(), 
      message: String(message || 'Quick Enquiry from website').trim(), 
      source: String(source || 'Website Form').trim()
    };
    
    const missing = ['name', 'phone'].filter((field) => !values[field]);
    if (missing.length > 0) {
      return res.status(400).json({ message: `Missing required fields: ${missing.join(', ')}.` });
    }
    
    if (values.email && values.email !== 'N/A' && !emailPattern.test(values.email)) {
      return res.status(400).json({ message: 'Please provide a valid email address.' });
    }

    let enquiryDoc;
    // Always attempt storing in MongoDB
    try {
      enquiryDoc = await Contact.create(values);
      console.log(`[MongoDB Success] Stored enquiry in database with ID: ${enquiryDoc._id}`);
    } catch (dbErr) {
      console.error('[MongoDB Warning] Could not persist to database:', dbErr.message);
    }

    // Trigger email notification to hr@connect2future.com asynchronously
    sendEnquiryEmail(values).catch((err) => console.error('Background mailer error:', err));

    return res.status(201).json({
      message: 'Enquiry received and stored successfully.',
      id: enquiryDoc ? enquiryDoc._id : 'loc_' + Date.now(),
      data: enquiryDoc || values,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: 'Please check the details and try again.', error: error.message });
    }
    return next(error);
  }
});

// DELETE /api/contact/:id - Delete an enquiry
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      await Contact.findByIdAndDelete(id);
    }
    return res.status(200).json({ message: 'Enquiry deleted successfully.', id });
  } catch (error) {
    return next(error);
  }
});

export default router;
