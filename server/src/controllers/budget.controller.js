import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const upsert = asyncHandler(async (req, res) => {
  const { month, amount } = req.body;
  const budget = await Budget.findOneAndUpdate(
    { user: req.userId, month },
    { amount },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(budget);
});

export const current = asyncHandler(async (req, res) => {
  const month = new Date().toISOString().slice(0, 7);
  const [y, mo] = month.split('-').map(Number);
  const start = new Date(Date.UTC(y, mo - 1, 1));
  const end = new Date(Date.UTC(y, mo, 1));

  const budget = await Budget.findOne({ user: req.userId, month });
  const spent = await Transaction.aggregate([
    { $match: { user: (await import('mongoose')).default.Types.ObjectId.createFromHexString(req.userId), type: 'expense', date: { $gte: start, $lt: end } } },
    { $group: { _id: null, total: { $sum: '$amount' } } },
  ]);
  const totalSpent = spent[0]?.total || 0;
  const amount = budget?.amount || 0;
  const used = amount ? (totalSpent / amount) * 100 : 0;

  res.json({
    month,
    amount,
    spent: totalSpent,
    remaining: Math.max(0, amount - totalSpent),
    usedPercent: Math.round(used),
    alert: amount && totalSpent > amount ? 'exceeded' : amount && used >= 80 ? 'warning' : null,
  });
});
