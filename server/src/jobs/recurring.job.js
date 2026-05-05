import cron from 'node-cron';
import Recurring from '../models/Recurring.js';
import Transaction from '../models/Transaction.js';

const dueNow = (rec, now) => {
  if (!rec.active) return false;
  const start = new Date(rec.startDate);
  if (now < start) return false;
  const last = rec.lastRun ? new Date(rec.lastRun) : null;
  const diffDays = last ? Math.floor((now - last) / 86400000) : Infinity;
  if (rec.frequency === 'daily')   return !last || diffDays >= 1;
  if (rec.frequency === 'weekly')  return !last || diffDays >= 7;
  if (rec.frequency === 'monthly') {
    if (!last) return true;
    return (now.getUTCFullYear() > last.getUTCFullYear()) ||
           (now.getUTCMonth() > last.getUTCMonth());
  }
  return false;
};

export const runRecurring = async () => {
  const now = new Date();
  const items = await Recurring.find({ active: true });
  for (const r of items) {
    if (dueNow(r, now)) {
      await Transaction.create({
        user: r.user, amount: r.amount, type: r.type,
        category: r.category, date: now, notes: `[recurring] ${r.notes || ''}`.trim(),
      });
      r.lastRun = now;
      await r.save();
    }
  }
};

export const startRecurringJob = () => {
  // every day at 00:05
  cron.schedule('5 0 * * *', () => {
    runRecurring().catch(console.error);
  });
  console.log('Recurring cron scheduled');
};
