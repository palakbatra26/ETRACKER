import mongoose from 'mongoose';

const splitSchema = new mongoose.Schema({
  transaction: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true, index: true },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: 'Workspace', index: true },
  splits: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: { type: String, enum: ['pending', 'paid'], default: 'pending' }
  }]
}, { timestamps: true });

export default mongoose.model('Split', splitSchema);
