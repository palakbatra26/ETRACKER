import { useTheme } from '../../context/ThemeContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function Topbar({ onMenu }) {
  const { dark, toggle } = useTheme();
  const { user, logout } = useAuth();
  return (
    <header className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 flex items-center px-4 justify-between sticky top-0 z-20">
      <button className="md:hidden btn-ghost" onClick={onMenu}>☰</button>
      <div className="font-semibold">Hi, {user?.name?.split(' ')[0]} 👋</div>
      <div className="flex items-center gap-2">
        <button className="btn-ghost" onClick={toggle} aria-label="Toggle theme">{dark ? '☀️' : '🌙'}</button>
        <button className="btn-ghost" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
