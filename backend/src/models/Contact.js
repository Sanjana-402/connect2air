import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true, maxlength: 254, default: 'N/A' },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    company: { type: String, trim: true, maxlength: 200, default: '' },
    message: { type: String, trim: true, maxlength: 3000, default: 'General Enquiry' },
    source: { type: String, trim: true, default: 'Website Form' },
  },
  {
    collection: 'contact_enquiries',
    timestamps: true,
  }
);

export default mongoose.model('Contact', contactSchema);
