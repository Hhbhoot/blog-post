import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import http from '../api';
import {
  LayoutDashboard,
  Users,
  FileText,
  PlusCircle,
  LogOut,
} from 'lucide-react';

const AdminNav = () => {
  const [logoutLoading, setLogoutLoading] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await http.get('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setLogoutLoading(false);
      navigate('/login');
    }
  };

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/users', label: 'Users', icon: Users },
    { to: '/admin/posts', label: 'Posts', icon: FileText, end: true },
    { to: '/admin/posts/create', label: 'Create Post', icon: PlusCircle },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 shadow-sm select-none">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Brand/Logo */}
        <div className="flex items-center gap-3">
          <Link to="/admin" className="flex items-center gap-2 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-[0_4px_10px_rgba(99,102,241,0.2)] text-white font-bold text-sm">
              B
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
              BlogSpace{' '}
              <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full ml-1">
                Admin
              </span>
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-2xl transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 border border-indigo-100/50 shadow-xs'
                      : 'text-slate-600 border border-transparent hover:bg-slate-50 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}

          <div className="h-6 w-[1px] bg-slate-200 mx-1 hidden sm:block" />

          {/* Logout Button */}
          <button
            type="button"
            disabled={logoutLoading}
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-rose-600 border border-transparent rounded-2xl hover:bg-rose-50/50 hover:border-rose-100/50 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>{logoutLoading ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNav;
