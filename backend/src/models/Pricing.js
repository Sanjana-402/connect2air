import mongoose from 'mongoose';

const pricingSchema = new mongoose.Schema(
  {
    step: { type: String, required: true, trim: true },
    price: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    badge: { type: String, trim: true, default: '' },
    timeline: { type: String, trim: true, default: '' },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Pricing', pricingSchema);
