import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    date: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Activity', activitySchema);