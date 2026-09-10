import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    company: { type: String, trim: true, maxlength: 100 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
  },
  {
    collection: 'contact_enquiries',
    timestamps: true,
  }
);

export default mongoose.model('Contact', contactSchema);
