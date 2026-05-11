import { useEffect, useState } from 'react';
import api from '../api/axios.js';

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async () => {
    const { data } = await api.get('/workspaces');
    setWorkspaces(data);
  };
  useEffect(() => { load(); }, []);

  const create = async (e) => {
    e.preventDefault();
    await api.post('/workspaces', { name });
    setName('');
    load();
  };

  const addMember = async (e) => {
    e.preventDefault();
    if (!selected) return;
    await api.post(`/workspaces/${selected._id}/members`, { email });
    setEmail('');
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Shared Workspaces</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <form onSubmit={create} className="card space-y-4">
          <h3 className="font-semibold">Create Workspace</h3>
          <input className="input" placeholder="Name (e.g. Home, Office)" value={name} onChange={e=>setName(e.target.value)} required />
          <button className="btn-primary">Create</button>
        </form>

        {selected && (
          <form onSubmit={addMember} className="card space-y-4">
            <h3 className="font-semibold">Add Member to {selected.name}</h3>
            <input className="input" type="email" placeholder="User Email" value={email} onChange={e=>setEmail(e.target.value)} required />
            <button className="btn-primary">Add</button>
          </form>
        )}
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {workspaces.map(ws => (
          <div key={ws._id} className={`card cursor-pointer border-2 ${selected?._id === ws._id ? 'border-brand' : 'border-transparent'}`} onClick={() => setSelected(ws)}>
            <div className="flex justify-between">
              <h3 className="font-semibold text-lg">{ws.name}</h3>
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded">{ws.owner.name === 'You' ? 'Owner' : 'Shared'}</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">Owner: {ws.owner.name}</p>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase text-gray-400">Members</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {ws.members.map(m => (
                  <span key={m.user._id} className="text-xs bg-brand/10 text-brand px-2 py-0.5 rounded">{m.user.name} ({m.role})</span>
                ))}
                {!ws.members.length && <span className="text-xs text-gray-400">Only you</span>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
