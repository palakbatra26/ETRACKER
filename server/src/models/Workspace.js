import mongoose from 'mongoose';

const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  members: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['admin', 'viewer'], default: 'viewer' }
  }]
}, { timestamps: true });

export default mongoose.model('Workspace', workspaceSchema);
