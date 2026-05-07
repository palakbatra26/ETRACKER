import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import StatCards from '../components/dashboard/StatCards.jsx';
import BudgetCard from '../components/budget/BudgetCard.jsx';
import IncomeExpenseBar from '../components/charts/IncomeExpenseBar.jsx';
import CategoryPie from '../components/charts/CategoryPie.jsx';
import DailyLine from '../components/charts/DailyLine.jsx';
import InsightsCard from '../components/dashboard/InsightsCard.jsx';

const rangeForMonth = (month) => {
  const [year, rawMonth] = month.split('-').map(Number);
  const next = new Date(Date.UTC(year, rawMonth, 1)).toISOString().slice(0, 10);
  return { from: `${month}-01`, to: next };
};

export default function Dashboard() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
  const [data, setData] = useState(null);
  const load = async () => {
    setData(null);
    const range = rangeForMonth(month);
    const [s, c, i, b] = await Promise.all([
      api.get('/transactions/summary', { params: range }),
      api.get('/transactions/charts', { params: { month } }),
      api.get('/transactions/insights', { params: { month } }),
      api.get('/budgets/current', { params: { month } }),
    ]);
    setData({ summary: s.data, charts: c.data, insights: i.data, budget: b.data });
  };
  useEffect(() => { load(); }, [month]);
  if (!data) return <div>Loading...</div>;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <input type="month" className="input w-auto" value={month} onChange={e=>setMonth(e.target.value)} />
      </div>
      <StatCards summary={data.summary} />
      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 card"><h3 className="font-semibold mb-4">Income vs Expense</h3><IncomeExpenseBar data={data.charts.bar} /></div>
        <BudgetCard budget={data.budget} />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card"><h3 className="font-semibold mb-4">Category Breakdown</h3><CategoryPie data={data.charts.pie} /></div>
        <div className="card"><h3 className="font-semibold mb-4">Daily Trend</h3><DailyLine data={data.charts.daily} /></div>
      </div>
      <InsightsCard insights={data.insights} />
    </div>
  );
}
