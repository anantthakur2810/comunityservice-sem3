import mongoose from 'mongoose';

const requirementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Requirement', requirementSchema);