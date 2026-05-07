import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import BudgetCard from '../components/budget/BudgetCard.jsx';

const CATS = ['Food','Travel','Bills','Shopping','Entertainment','Health','Salary','Other'];

export default function Budget() {
  const [month, setMonth] = useState(new Date().toISOString().slice(0,7));
  const [budget, setBudget] = useState(null);
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState([{ category: 'Food', amount: '' }]);

  const load = async () => {
    const { data } = await api.get('/budgets/current', { params: { month } });
    setBudget(data);
    setAmount(data.amount || '');
    setCategories(data.categories?.length ? data.categories.map(c => ({ category: c.category, amount: c.amount })) : [{ category: 'Food', amount: '' }]);
  };

  useEffect(() => { load(); }, [month]);

  const save = async (e) => {
    e.preventDefault();
    await api.put('/budgets', {
      month,
      amount: Number(amount),
      categories: categories
        .filter(c => c.category && c.amount !== '')
        .map(c => ({ category: c.category, amount: Number(c.amount) })),
    });
    load();
  };

  const updateCategory = (idx, key, value) => {
    setCategories(categories.map((c, i) => i === idx ? { ...c, [key]: value } : c));
  };

  if (!budget) return <div>Loading...</div>;
  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h1 className="text-2xl font-bold">Monthly Budget</h1>
        <input type="month" className="input w-auto" value={month} onChange={e=>setMonth(e.target.value)}/>
      </div>
      <BudgetCard budget={budget} />
      <form onSubmit={save} className="card space-y-4">
        <h3 className="font-semibold">Set budget for {month}</h3>
        <div>
          <label className="label">Overall monthly budget</label>
          <input className="input" type="number" min="0" step="1" required placeholder="Amount"
            value={amount} onChange={e=>setAmount(e.target.value)}/>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h4 className="font-semibold">Category budgets</h4>
            <button type="button" className="btn-ghost" onClick={()=>setCategories([...categories, { category: 'Food', amount: '' }])}>+ Add category</button>
          </div>
          {categories.map((item, idx) => (
            <div key={idx} className="grid grid-cols-[1fr_1fr_auto] gap-3">
              <select className="input" value={item.category} onChange={e=>updateCategory(idx, 'category', e.target.value)}>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
              <input className="input" type="number" min="0" step="1" placeholder="Amount"
                value={item.amount} onChange={e=>updateCategory(idx, 'amount', e.target.value)}/>
              <button type="button" className="btn-ghost" onClick={()=>setCategories(categories.filter((_, i) => i !== idx))}>Remove</button>
            </div>
          ))}
        </div>
        <button className="btn-primary">Save budget</button>
      </form>
    </div>
  );
}
