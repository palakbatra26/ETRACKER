import { useEffect, useState } from 'react';
import api from '../api/axios.js';
const CATS = ['Food','Travel','Bills','Shopping','Entertainment','Health','Salary','Other'];

export default function Recurring() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ amount:'', type:'expense', category:'Bills', frequency:'monthly', startDate: new Date().toISOString().slice(0,10), notes:'' });
  const load = async () => { const { data } = await api.get('/recurring'); setItems(data); };
  useEffect(() => { load(); }, []);
  const submit = async (e) => {
    e.preventDefault();
    await api.post('/recurring', { ...form, amount: Number(form.amount) });
    setForm({ ...form, amount:'', notes:'' }); load();
  };
  const remove = async (id) => { await api.delete(`/recurring/${id}`); load(); };
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recurring Transactions</h1>
      <form onSubmit={submit} className="card grid md:grid-cols-6 gap-3">
        <input className="input" type="number" placeholder="Amount" required value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/>
        <select className="input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}><option value="expense">Expense</option><option value="income">Income</option></select>
        <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>{CATS.map(c=><option key={c}>{c}</option>)}</select>
        <select className="input" value={form.frequency} onChange={e=>setForm({...form,frequency:e.target.value})}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option></select>
        <input className="input" type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})}/>
        <button className="btn-primary">Add</button>
      </form>
      <div className="card">
        {items.length === 0 ? <p className="text-gray-500 text-sm">No recurring items.</p> : (
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map(i => (
              <li key={i._id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium">{i.category} • {i.frequency}</div>
                  <div className="text-sm text-gray-500">{i.type} • ${i.amount} • starts {new Date(i.startDate).toLocaleDateString()}</div>
                </div>
                <button className="text-rose-600 text-sm" onClick={()=>remove(i._id)}>Delete</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
