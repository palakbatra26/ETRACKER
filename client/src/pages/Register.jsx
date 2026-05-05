import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth(); const nav = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try { await register(form.name, form.email, form.password); nav('/'); }
    catch (e) { setErr(e.response?.data?.message || 'Failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Create account</h1>
        {err && <div className="text-red-600 text-sm">{err}</div>}
        <div><label className="label">Name</label><input className="input" required autoComplete="name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
        <div><label className="label">Email</label><input className="input" type="email" required autoComplete="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></div>
        <div><label className="label">Password (min 8)</label><input className="input" type="password" minLength={8} required autoComplete="new-password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/></div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? '…' : 'Create account'}</button>
        <p className="text-sm text-center">Have an account? <Link to="/login" className="text-brand">Sign in</Link></p>
      </form>
    </div>
  );
}
