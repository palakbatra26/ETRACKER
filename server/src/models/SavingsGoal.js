import mongoose from 'mongoose';

const savingsGoalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 80 },
  targetAmount: { type: Number, required: true, min: 1 },
  currentAmount: { type: Number, required: true, min: 0, default: 0 },
  targetDate: { type: Date },
  notes: { type: String, maxlength: 300 },
}, { timestamps: true });

savingsGoalSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('SavingsGoal', savingsGoalSchema);
