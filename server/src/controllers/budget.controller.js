import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const upsert = asyncHandler(async (req, res) => {
  const { month, amount, categories = [] } = req.body;
  const budget = await Budget.findOneAndUpdate(
    { user: req.userId, month },
    { amount, categories },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  res.json(budget);
});

const monthRange = (month) => {
  const [y, mo] = month.split('-').map(Number);
  return {
    start: new Date(Date.UTC(y, mo - 1, 1)),
    end: new Date(Date.UTC(y, mo, 1)),
  };
};

const alertFor = (amount, spent) => {
  if (!amount) return null;
  const used = (spent / amount) * 100;
  if (spent > amount) return 'exceeded';
  if (used >= 80) return 'warning';
  if (used >= 50) return 'notice';
  return null;
};

export const current = asyncHandler(async (req, res) => {
  const month = req.query.month || new Date().toISOString().slice(0, 7);
  const { start, end } = monthRange(month);

  const budget = await Budget.findOne({ user: req.userId, month });
  const mongoose = (await import('mongoose')).default;
  const user = mongoose.Types.ObjectId.createFromHexString(req.userId);
  const [spent, categorySpent] = await Promise.all([
    Transaction.aggregate([
      { $match: { user, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    Transaction.aggregate([
      { $match: { user, type: 'expense', date: { $gte: start, $lt: end } } },
      { $group: { _id: '$category', total: { $sum: '$amount' } } },
    ]),
  ]);
  const spentByCategory = Object.fromEntries(categorySpent.map(c => [c._id, c.total]));
  const categoryBudgets = (budget?.categories || []).map(c => {
    const spent = spentByCategory[c.category] || 0;
    const used = c.amount ? (spent / c.amount) * 100 : 0;
    return {
      category: c.category,
      amount: c.amount,
      spent,
      remaining: Math.max(0, c.amount - spent),
      usedPercent: Math.round(used),
      alert: alertFor(c.amount, spent),
    };
  });

  const totalSpent = spent[0]?.total || 0;
  const amount = budget?.amount || 0;
  const used = amount ? (totalSpent / amount) * 100 : 0;

  res.json({
    month,
    amount,
    spent: totalSpent,
    remaining: Math.max(0, amount - totalSpent),
    usedPercent: Math.round(used),
    alert: alertFor(amount, totalSpent),
    categories: categoryBudgets,
  });
});

export const history = asyncHandler(async (req, res) => {
  const items = await Budget.find({ user: req.userId }).sort({ month: -1 }).limit(12);
  res.json(items);
});
