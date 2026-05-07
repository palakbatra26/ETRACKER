import { useState } from 'react';
import api from '../../api/axios.js';

const METHODS = ['Cash', 'UPI', 'Credit Card', 'Debit Card', 'Bank Transfer', 'Other'];

export default function TransactionForm({ initial, onClose, onSaved, categories }) {
  const [form, setForm] = useState({
    amount: initial?.amount || '',
    type: initial?.type || 'expense',
    category: initial?.category || categories[0],
    paymentMethod: initial?.paymentMethod || 'Cash',
    tags: (initial?.tags || []).join(', '),
    date: (initial?.date || new Date().toISOString()).slice(0, 10),
    notes: initial?.notes || '',
  });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault(); setLoading(true); setErr('');
    try {
      const body = {
        ...form,
        amount: Number(form.amount),
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        date: new Date(form.date).toISOString(),
      };
      if (initial) await api.put(`/transactions/${initial._id}`, body);
      else await api.post('/transactions', body);
      onSaved();
    } catch (e) { setErr(e.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <form onClick={e=>e.stopPropagation()} onSubmit={submit} className="card w-full max-w-md space-y-3">
        <h2 className="text-lg font-bold">{initial ? 'Edit' : 'Add'} Transaction</h2>
        {err && <div className="text-rose-600 text-sm">{err}</div>}
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Type</label>
            <select className="input" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
              <option value="expense">Expense</option><option value="income">Income</option>
            </select></div>
          <div><label className="label">Amount</label>
            <input className="input" type="number" min="0" step="0.01" required value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})}/></div>
        </div>
        <div><label className="label">Category</label>
          <select className="input" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
            {categories.map(c => <option key={c}>{c}</option>)}
          </select></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label className="label">Payment method</label>
            <select className="input" value={form.paymentMethod} onChange={e=>setForm({...form,paymentMethod:e.target.value})}>
              {METHODS.map(m => <option key={m}>{m}</option>)}
            </select></div>
          <div><label className="label">Date</label>
            <input className="input" type="date" required value={form.date} onChange={e=>setForm({...form,date:e.target.value})}/></div>
        </div>
        <div><label className="label">Tags</label>
          <input className="input" placeholder="work, tax, family" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})}/></div>
        <div><label className="label">Notes</label>
          <textarea className="input" rows="2" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})}/></div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-ghost" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={loading}>{loading ? '...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
}
