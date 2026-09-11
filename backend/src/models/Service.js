import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    number: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
