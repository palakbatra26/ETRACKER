import { useEffect, useState } from 'react';
import api from '../api/axios.js';
import TransactionForm from '../components/transactions/TransactionForm.jsx';

const CATS = ['Food','Travel','Bills','Shopping','Entertainment','Health','Salary','Other'];
const METHODS = ['Cash','UPI','Credit Card','Debit Card','Bank Transfer','Other'];
const fmt = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n || 0);

export default function Transactions() {
  const [list, setList] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [filters, setFilters] = useState({ type: '', category: '', paymentMethod: '', tag: '', from: '', to: '', q: '', page: 1, limit: 10 });
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await api.get('/transactions', { params: filters });
    setList(data);
  };
  useEffect(() => { load(); }, [filters]);

  const onSaved = () => { setShowForm(false); setEditing(null); load(); };
  const remove = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    await api.delete(`/transactions/${id}`); load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
        <button className="btn-primary" onClick={() => { setEditing(null); setShowForm(true); }}>+ Add</button>
      </div>

      <div className="card grid md:grid-cols-4 lg:grid-cols-7 gap-3">
        <input className="input" placeholder="Search notes..." value={filters.q}
          onChange={e=>setFilters({...filters, q:e.target.value, page:1})}/>
        <select className="input" value={filters.type} onChange={e=>setFilters({...filters,type:e.target.value,page:1})}>
          <option value="">All types</option><option value="income">Income</option><option value="expense">Expense</option>
        </select>
        <select className="input" value={filters.category} onChange={e=>setFilters({...filters,category:e.target.value,page:1})}>
          <option value="">All categories</option>{CATS.map(c=><option key={c}>{c}</option>)}
        </select>
        <select className="input" value={filters.paymentMethod} onChange={e=>setFilters({...filters,paymentMethod:e.target.value,page:1})}>
          <option value="">All methods</option>{METHODS.map(m=><option key={m}>{m}</option>)}
        </select>
        <input className="input" placeholder="Tag" value={filters.tag}
          onChange={e=>setFilters({...filters,tag:e.target.value,page:1})}/>
        <input className="input" type="date" value={filters.from} onChange={e=>setFilters({...filters,from:e.target.value,page:1})}/>
        <input className="input" type="date" value={filters.to} onChange={e=>setFilters({...filters,to:e.target.value,page:1})}/>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="text-left text-gray-500">
            <tr><th className="py-2">Date</th><th>Type</th><th>Category</th><th>Method</th><th>Tags</th><th>Notes</th><th className="text-right">Amount</th><th></th></tr>
          </thead>
          <tbody>
            {list.items.map(t => (
              <tr key={t._id} className="border-t border-gray-100 dark:border-gray-800">
                <td className="py-3">{new Date(t.date).toLocaleDateString()}</td>
                <td><span className={`px-2 py-0.5 rounded text-xs ${t.type==='income'?'bg-emerald-100 text-emerald-700':'bg-rose-100 text-rose-700'}`}>{t.type}</span></td>
                <td>{t.category}</td>
                <td>{t.paymentMethod || 'Cash'}</td>
                <td className="min-w-32">
                  <div className="flex flex-wrap gap-1">
                    {(t.tags || []).map(tag => <span key={tag} className="px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-xs">{tag}</span>)}
                  </div>
                </td>
                <td className="text-gray-500 max-w-xs truncate">{t.notes}</td>
                <td className={`text-right font-semibold ${t.type==='income'?'text-emerald-600':'text-rose-600'}`}>{t.type==='income'?'+':'-'}{fmt(t.amount)}</td>
                <td className="text-right space-x-2">
                  <button className="text-brand" onClick={()=>{setEditing(t); setShowForm(true);}}>Edit</button>
                  <button className="text-rose-600" onClick={()=>remove(t._id)}>Delete</button>
                </td>
              </tr>
            ))}
            {!list.items.length && <tr><td colSpan="8" className="py-8 text-center text-gray-500">No transactions</td></tr>}
          </tbody>
        </table>
        <div className="flex items-center justify-between mt-4 text-sm">
          <div>Total: {list.total}</div>
          <div className="flex gap-2">
            <button className="btn-ghost" disabled={filters.page<=1} onClick={()=>setFilters({...filters,page:filters.page-1})}>Prev</button>
            <span className="py-2">Page {list.page} / {list.pages || 1}</span>
            <button className="btn-ghost" disabled={filters.page>=list.pages} onClick={()=>setFilters({...filters,page:filters.page+1})}>Next</button>
          </div>
        </div>
      </div>

      {showForm && <TransactionForm initial={editing} onClose={()=>{setShowForm(false);setEditing(null);}} onSaved={onSaved} categories={CATS}/>}
    </div>
  );
}
