import Recurring from '../models/Recurring.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const items = await Recurring.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(items);
});
export const create = asyncHandler(async (req, res) => {
  const item = await Recurring.create({ ...req.body, user: req.userId });
  res.status(201).json(item);
});
export const remove = asyncHandler(async (req, res) => {
  const r = await Recurring.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!r) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});
