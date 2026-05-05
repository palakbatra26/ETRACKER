import mongoose from 'mongoose';

const txSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount:   { type: Number, required: true, min: 0 },
  type:     { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true, trim: true },
  date:     { type: Date, required: true, default: Date.now, index: true },
  notes:    { type: String, maxlength: 500 },
}, { timestamps: true });

txSchema.index({ user: 1, date: -1 });
txSchema.index({ user: 1, category: 1 });

export default mongoose.model('Transaction', txSchema);
