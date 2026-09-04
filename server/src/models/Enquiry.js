import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    type: {
      type: String,
      enum: ['donation', 'support', 'partnership', 'other'],
      default: 'other',
    },
    amount: { type: String, trim: true },
    message: { type: String, trim: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'resolved'],
      default: 'new',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Enquiry', enquirySchema);