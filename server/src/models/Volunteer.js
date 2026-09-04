import mongoose from 'mongoose';

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    skills: { type: String, trim: true },
    availability: { type: String, trim: true },
    message: { type: String, trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Volunteer', volunteerSchema);