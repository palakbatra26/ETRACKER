import { NavLink } from 'react-router-dom';

const items = [
  { to: '/', label: 'Dashboard', icon: 'DB' },
  { to: '/transactions', label: 'Transactions', icon: 'TX' },
  { to: '/budget', label: 'Budget', icon: 'BG' },
  { to: '/savings-goals', label: 'Savings Goals', icon: '$' },
  { to: '/recurring', label: 'Recurring', icon: 'RC' },
  { to: '/reports', label: 'Reports', icon: 'RP' },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="fixed inset-0 bg-black/40 md:hidden z-30" onClick={onClose} />}
      <aside className={`fixed md:static inset-y-0 left-0 w-64 z-40 transform md:transform-none transition
        ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4`}>
        <div className="text-xl font-bold mb-6 px-2">Expense<span className="text-brand">Pro</span></div>
        <nav className="space-y-1">
          {items.map(i => (
            <NavLink key={i.to} to={i.to} end onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg ${isActive
                  ? 'bg-brand/10 text-brand font-semibold'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <span className="w-6 text-xs font-semibold text-center">{i.icon}</span>{i.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
