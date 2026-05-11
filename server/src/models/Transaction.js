import mongoose from 'mongoose';

const txSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  amount:   { type: Number, required: true, min: 0 },
  type:     { type: String, enum: ['income', 'expense'], required: true },
  category: { type: String, required: true, trim: true },
  tags:     [{ type: String, trim: true, maxlength: 30 }],
  paymentMethod: {
    type: String,
    enum: ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'],
    default: 'Cash',
  },
  date:     { type: Date, required: true, default: Date.now, index: true },
  notes:    { type: String, maxlength: 500 },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', index: true },
  currency:  { type: String, default: 'USD' },
}, { timestamps: true });

txSchema.index({ user: 1, date: -1 });
txSchema.index({ user: 1, category: 1 });
txSchema.index({ user: 1, tags: 1 });
txSchema.index({ user: 1, paymentMethod: 1 });

export default mongoose.model('Transaction', txSchema);
