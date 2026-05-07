import { useEffect, useState } from 'react';
import api from '../api/axios.js';

const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);
const blank = { name: '', targetAmount: '', currentAmount: '', targetDate: '', notes: '' };

export default function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const { data } = await api.get('/savings-goals');
    setGoals(data);
  };
  useEffect(() => { load(); }, []);

  const submit = async (e) => {
    e.preventDefault();
    const body = {
      ...form,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount || 0),
    };
    if (editing) await api.put(`/savings-goals/${editing}`, body);
    else await api.post('/savings-goals', body);
    setForm(blank);
    setEditing(null);
    load();
  };

  const edit = (goal) => {
    setEditing(goal._id);
    setForm({
      name: goal.name,
      targetAmount: goal.targetAmount,
      currentAmount: goal.currentAmount,
      targetDate: goal.targetDate ? goal.targetDate.slice(0, 10) : '',
      notes: goal.notes || '',
    });
  };

  const remove = async (id) => {
    if (!confirm('Delete this savings goal?')) return;
    await api.delete(`/savings-goals/${id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Savings Goals</h1>
      <form onSubmit={submit} className="card grid md:grid-cols-5 gap-3 items-end">
        <div><label className="label">Goal</label><input className="input" required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
        <div><label className="label">Target</label><input className="input" type="number" min="1" step="1" required value={form.targetAmount} onChange={e=>setForm({...form,targetAmount:e.target.value})}/></div>
        <div><label className="label">Saved</label><input className="input" type="number" min="0" step="1" value={form.currentAmount} onChange={e=>setForm({...form,currentAmount:e.target.value})}/></div>
        <div><label className="label">Target date</label><input className="input" type="date" value={form.targetDate} onChange={e=>setForm({...form,targetDate:e.target.value})}/></div>
        <button className="btn-primary">{editing ? 'Update' : 'Add'} goal</button>
        <div className="md:col-span-5"><label className="label">Notes</label><input className="input" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
      </form>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {goals.map(goal => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          return (
            <div key={goal._id} className="card space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{goal.name}</h3>
                  {goal.targetDate && <p className="text-sm text-gray-500">By {new Date(goal.targetDate).toLocaleDateString()}</p>}
                </div>
                <div className="space-x-2 text-sm">
                  <button className="text-brand" onClick={()=>edit(goal)}>Edit</button>
                  <button className="text-rose-600" onClick={()=>remove(goal._id)}>Delete</button>
                </div>
              </div>
              <div className="text-sm text-gray-500">{fmt(goal.currentAmount)} saved of {fmt(goal.targetAmount)}</div>
              <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
                <div className="h-3 bg-emerald-500" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex justify-between text-sm">
                <span><b>{pct}%</b> complete</span>
                <span>{fmt(Math.max(0, goal.targetAmount - goal.currentAmount))} left</span>
              </div>
              {goal.notes && <p className="text-sm text-gray-500">{goal.notes}</p>}
            </div>
          );
        })}
        {!goals.length && <div className="card text-gray-500">No savings goals yet.</div>}
      </div>
    </div>
  );
}
