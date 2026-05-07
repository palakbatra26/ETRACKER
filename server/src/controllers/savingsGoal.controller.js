import SavingsGoal from '../models/SavingsGoal.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const items = await SavingsGoal.find({ user: req.userId }).sort({ createdAt: -1 });
  res.json(items);
});

export const create = asyncHandler(async (req, res) => {
  const goal = await SavingsGoal.create({
    ...req.body,
    targetDate: req.body.targetDate || undefined,
    user: req.userId,
  });
  res.status(201).json(goal);
});

export const update = asyncHandler(async (req, res) => {
  const goal = await SavingsGoal.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { ...req.body, targetDate: req.body.targetDate || undefined },
    { new: true, runValidators: true }
  );
  if (!goal) return res.status(404).json({ message: 'Not found' });
  res.json(goal);
});

export const remove = asyncHandler(async (req, res) => {
  const goal = await SavingsGoal.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!goal) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});
