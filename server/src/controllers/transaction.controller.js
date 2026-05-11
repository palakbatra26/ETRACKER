import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const list = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 10);
  const filter = { user: req.userId };
  if (req.query.type) filter.type = req.query.type;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.paymentMethod) filter.paymentMethod = req.query.paymentMethod;
  if (req.query.tag) filter.tags = req.query.tag;
  if (req.query.from || req.query.to) {
    filter.date = {};
    if (req.query.from) filter.date.$gte = new Date(req.query.from);
    if (req.query.to)   filter.date.$lte = new Date(req.query.to);
  }
  if (req.query.q) filter.notes = { $regex: req.query.q, $options: 'i' };

  const [items, total] = await Promise.all([
    Transaction.find(filter).sort({ date: -1 }).skip((page - 1) * limit).limit(limit),
    Transaction.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

export const create = asyncHandler(async (req, res) => {
  const tx = await Transaction.create({ ...req.body, user: req.userId });
  res.status(201).json(tx);
});

export const update = asyncHandler(async (req, res) => {
  const tx = await Transaction.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    req.body,
    { new: true, runValidators: true }
  );
  if (!tx) return res.status(404).json({ message: 'Not found' });
  res.json(tx);
});

export const remove = asyncHandler(async (req, res) => {
  const tx = await Transaction.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!tx) return res.status(404).json({ message: 'Not found' });
  res.json({ ok: true });
});

export const summary = asyncHandler(async (req, res) => {
  const match = { user: new (await import('mongoose')).default.Types.ObjectId(req.userId) };
  if (req.query.from || req.query.to) {
    match.date = {};
    if (req.query.from) match.date.$gte = new Date(req.query.from);
    if (req.query.to) match.date.$lt = new Date(req.query.to);
  }
  const agg = await Transaction.aggregate([
    { $match: match },
    { $group: { _id: '$type', total: { $sum: '$amount' } } },
  ]);
  let income = 0, expense = 0;
  agg.forEach(r => { if (r._id === 'income') income = r.total; else expense = r.total; });
  res.json({ income, expense, balance: income - expense });
});

const monthRange = (m) => {
  const [y, mo] = (m || new Date().toISOString().slice(0, 7)).split('-').map(Number);
  const start = new Date(Date.UTC(y, mo - 1, 1));
  const end = new Date(Date.UTC(y, mo, 1));
  return { start, end };
};

export const insights = asyncHandler(async (req, res) => {
  const mongoose = (await import('mongoose')).default;
  const { start, end } = monthRange(req.query.month);
  const userId = new mongoose.Types.ObjectId(req.userId);

  const txs = await Transaction.find({ user: userId, date: { $gte: start, $lt: end } });
  const expenses = txs.filter(t => t.type === 'expense');
  const totalExpense = expenses.reduce((s, t) => s + t.amount, 0);
  const totalIncome = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  const byCat = {};
  expenses.forEach(t => { byCat[t.category] = (byCat[t.category] || 0) + t.amount; });
  const top = Object.entries(byCat).sort((a, b) => b[1] - a[1])[0];
  const days = Math.max(1, Math.ceil((Math.min(end, new Date()) - start) / 86400000));

  res.json({
    totalIncome,
    totalExpense,
    topCategory: top ? { category: top[0], amount: top[1], percent: Math.round((top[1] / totalExpense) * 100) } : null,
    averageDaily: totalExpense / days,
    projectedMonthly: (totalExpense / days) * 30,
    breakdown: Object.entries(byCat).map(([category, amount]) => ({
      category, amount, percent: totalExpense ? Math.round((amount / totalExpense) * 100) : 0,
    })),
  });
});

export const charts = asyncHandler(async (req, res) => {
  const mongoose = (await import('mongoose')).default;
  const { start, end } = monthRange(req.query.month);
  const userId = new mongoose.Types.ObjectId(req.userId);

  const txs = await Transaction.find({ user: userId, date: { $gte: start, $lt: end } });

  // Daily line
  const dailyMap = {};
  txs.forEach(t => {
    const k = t.date.toISOString().slice(0, 10);
    dailyMap[k] = dailyMap[k] || { date: k, income: 0, expense: 0 };
    dailyMap[k][t.type] += t.amount;
  });
  const daily = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));

  // Pie by expense category
  const pieMap = {};
  txs.filter(t => t.type === 'expense').forEach(t => {
    pieMap[t.category] = (pieMap[t.category] || 0) + t.amount;
  });
  const pie = Object.entries(pieMap).map(([name, value]) => ({ name, value }));

  // 6-month bar
  const sixMonths = await Transaction.aggregate([
    { $match: {
      user: userId,
      date: { $gte: new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() - 5, 1)) }
    }},
    { $group: {
      _id: { y: { $year: '$date' }, m: { $month: '$date' }, t: '$type' },
      total: { $sum: '$amount' },
    }},
  ]);
  const barMap = {};
  sixMonths.forEach(r => {
    const k = `${r._id.y}-${String(r._id.m).padStart(2, '0')}`;
    barMap[k] = barMap[k] || { month: k, income: 0, expense: 0 };
    barMap[k][r._id.t] += r.total;
  });
  const bar = Object.values(barMap).sort((a, b) => a.month.localeCompare(b.month));

  res.json({ daily, pie, bar });
});
