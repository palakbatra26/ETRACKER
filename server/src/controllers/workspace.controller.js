import { asyncHandler } from '../utils/asyncHandler.js';
import Workspace from '../models/Workspace.js';
import User from '../models/User.js';

export const list = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({
    $or: [{ owner: req.userId }, { 'members.user': req.userId }]
  }).populate('owner members.user', 'name email');
  res.json(workspaces);
});

export const create = asyncHandler(async (req, res) => {
  const ws = await Workspace.create({ ...req.body, owner: req.userId });
  res.status(201).json(ws);
});

export const addMember = asyncHandler(async (req, res) => {
  const { email, role } = req.body;
  const userToAdd = await User.findOne({ email });
  if (!userToAdd) return res.status(404).json({ message: 'User not found' });

  const ws = await Workspace.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    { $addToSet: { members: { user: userToAdd._id, role: role || 'viewer' } } },
    { new: true }
  );
  if (!ws) return res.status(404).json({ message: 'Workspace not found or not owner' });
  res.json(ws);
});
