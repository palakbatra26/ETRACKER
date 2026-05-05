import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import BudgetCard from '../components/budget/BudgetCard.jsx';

export default function Budget() {
  const [budget, setBudget] = useState(null);
  const [amount, setAmount] = useState('');
  const load = async () => { const { data } = await api.get('/budgets/current'); setBudget(data); setAmount(data.amount || ''); };
  useEffect(() => { load(); }, []);
  const save = async (e) => {
    e.preventDefault();
    await api.put('/budgets', { month: new Date().toISOString().slice(0,7), amount: Number(amount) });
    load();
  };
  if (!budget) return <div>Loading…</div>;
  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">Monthly Budget</h1>
      <BudgetCard budget={budget} />
      <form onSubmit={save} className="card space-y-3">
        <h3 className="font-semibold">Set budget for {budget.month}</h3>
        <input className="input" type="number" min="0" step="1" required placeholder="Amount"
          value={amount} onChange={e=>setAmount(e.target.value)}/>
        <button className="btn-primary">Save</button>
      </form>
    </div>
  );
}
