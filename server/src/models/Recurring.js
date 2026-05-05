import mongoose from 'mongoose';

const recurringSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount:    { type: Number, required: true, min: 0 },
  type:      { type: String, enum: ['income', 'expense'], required: true },
  category:  { type: String, required: true },
  frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], required: true },
  startDate: { type: Date, required: true },
  lastRun:   { type: Date },
  notes:     { type: String, maxlength: 500 },
  active:    { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('Recurring', recurringSchema);
