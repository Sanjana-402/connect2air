import mongoose from 'mongoose';

const mediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    tagline: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    type: { type: String, enum: ['video', 'image'], required: true },
    url: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    aspectRatio: { type: String, default: 'portrait' },
    size: { type: String, enum: ['reel', 'post', 'square'], default: 'reel' },
  },
  { timestamps: true }
);

export default mongoose.model('Media', mediaSchema);
