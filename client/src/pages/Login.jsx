import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setErr(''); setLoading(true);
    try { await login(form.email, form.password); nav('/'); }
    catch (e) { setErr(e.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <form onSubmit={submit} className="card w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        {err && <div className="text-red-600 text-sm">{err}</div>}
<div><label className="label">Email</label>
           <input className="input" type="email" required autoComplete="email" value={form.email}
             onChange={e => setForm({ ...form, email: e.target.value })}/></div>
<div><label className="label">Password</label>
           <input className="input" type="password" required autoComplete="current-password" value={form.password}
             onChange={e => setForm({ ...form, password: e.target.value })}/></div>
        <button className="btn-primary w-full" disabled={loading}>{loading ? '…' : 'Sign in'}</button>
        <p className="text-sm text-center">No account? <Link to="/register" className="text-brand">Create one</Link></p>
      </form>
    </div>
  );
}
