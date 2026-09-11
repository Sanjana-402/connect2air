import express from 'express';
import Pricing from '../models/Pricing.js';

const router = express.Router();

const DEFAULT_PRICING = [
  {
    step: 'ONE FLY',
    price: '₹15,000',
    duration: '10 MINS',
    badge: '1 Flight',
    timeline: 'Single Display',
    description: '1 Flight duration of 10 minutes over the venue crowd.',
  },
  {
    step: 'TWO FLIES',
    price: '₹30,000',
    duration: '20 MINS',
    badge: '2 Flights',
    timeline: '2 Sessions',
    description: '2 Flights totaling 20 minutes with 1 hour interval.',
  },
  {
    step: 'THREE FLIES',
    price: '₹45,000',
    duration: '30 MINS',
    badge: '3 Flights',
    timeline: '3 Sessions',
    description: '3 Flights totaling 30 minutes with 1 hour intervals.',
  },
  {
    step: 'CUSTOM DISPLAY',
    price: 'Variable Price',
    duration: 'Custom Duration',
    badge: 'Based on Duration',
    timeline: 'As Per Requirement',
    description: 'A Custom type Drone LED Display can be made as per the Client requirements.',
  },
];

// GET /api/pricing — List all pricing cards (seed defaults if empty)
router.get('/', async (_req, res) => {
  try {
    let items = await Pricing.find().sort({ createdAt: 1 });
    if (items.length === 0) {
      items = await Pricing.insertMany(DEFAULT_PRICING);
    }
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('Failed to fetch pricing:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch pricing packages.' });
  }
});

// POST /api/pricing — Add new pricing card
router.post('/', async (req, res) => {
  try {
    const { step, price, duration, badge, timeline, description } = req.body;
    if (!step || !price || !duration) {
      return res.status(400).json({ success: false, message: 'Title, price, and duration are required.' });
    }
    const item = await Pricing.create({
      step,
      price,
      duration,
      badge: badge || '',
      timeline: timeline || '',
      description: description || '',
    });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error('Failed to create pricing item:', err);
    res.status(500).json({ success: false, message: 'Failed to create pricing package.' });
  }
});

// PATCH /api/pricing/:id — Update pricing card
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Pricing.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Pricing package not found.' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Failed to update pricing item:', err);
    res.status(500).json({ success: false, message: 'Failed to update pricing package.' });
  }
});

// DELETE /api/pricing/:id — Delete pricing card
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Pricing.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Pricing package not found.' });
    res.json({ success: true, message: 'Pricing package deleted.' });
  } catch (err) {
    console.error('Failed to delete pricing item:', err);
    res.status(500).json({ success: false, message: 'Failed to delete pricing package.' });
  }
});

export default router;
