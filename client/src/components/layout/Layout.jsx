import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import Topbar from './Topbar.jsx';

export default function Layout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="p-4 md:p-8 max-w-7xl w-full mx-auto"><Outlet /></main>
      </div>
    </div>
  );
}
