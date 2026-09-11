import express from 'express';
import Service from '../models/Service.js';

const router = express.Router();

const DEFAULT_SERVICES = [
  {
    number: '01',
    title: 'Drone LED advertising',
    category: 'Core display',
    description: 'A synchronised formation of LED-carrying drones renders your message as a floating, animated screen above any venue.',
  },
  {
    number: '02',
    title: 'Brand activations',
    category: 'Experiential',
    description: 'Launch moments engineered for the sky — reveals, countdowns and logo formations built around your activation.',
  },
  {
    number: '03',
    title: 'Event & concert displays',
    category: 'Live entertainment',
    description: 'Synced to music and lighting cues, the display becomes part of the show rather than an interruption to it.',
  },
  {
    number: '04',
    title: 'Product & store launches',
    category: 'Retail',
    description: 'Announce a launch above the storefront or venue itself, visible long before anyone reaches the door.',
  },
  {
    number: '05',
    title: 'Custom aerial experiences',
    category: 'Bespoke',
    description: 'Flight paths, formations and screen content designed from scratch around a brief that does not fit a template.',
  },
];

// GET /api/services — List all services (seed defaults if empty)
router.get('/', async (_req, res) => {
  try {
    let items = await Service.find().sort({ createdAt: 1 });
    if (items.length === 0) {
      items = await Service.insertMany(DEFAULT_SERVICES);
    }
    res.json({ success: true, data: items });
  } catch (err) {
    console.error('Failed to fetch services:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch services.' });
  }
});

// POST /api/services — Add new service
router.post('/', async (req, res) => {
  try {
    const { title, category, description } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ success: false, message: 'Title, category, and description are required.' });
    }
    const count = await Service.countDocuments();
    const number = String(count + 1).padStart(2, '0');
    const item = await Service.create({ number, title, category, description });
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    console.error('Failed to create service:', err);
    res.status(500).json({ success: false, message: 'Failed to create service.' });
  }
});

// PATCH /api/services/:id — Update service
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ success: false, message: 'Service not found.' });
    res.json({ success: true, data: updated });
  } catch (err) {
    console.error('Failed to update service:', err);
    res.status(500).json({ success: false, message: 'Failed to update service.' });
  }
});

// DELETE /api/services/:id — Delete service & re-index numbers
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Service.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Service not found.' });

    // Re-number remaining services
    const remaining = await Service.find().sort({ createdAt: 1 });
    for (let i = 0; i < remaining.length; i++) {
      remaining[i].number = String(i + 1).padStart(2, '0');
      await remaining[i].save();
    }

    res.json({ success: true, message: 'Service deleted.' });
  } catch (err) {
    console.error('Failed to delete service:', err);
    res.status(500).json({ success: false, message: 'Failed to delete service.' });
  }
});

export default router;
