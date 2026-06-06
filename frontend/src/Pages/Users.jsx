import AdminNav from '../Components/AdminNav';
import { useState, useEffect } from 'react';
import http from '../api';
import LoadingSpinner from '../Components/LoadingSpinner';
import { Users as UsersIcon, Mail, ShieldCheck, User } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await http.get('/auth/get-users');
        if (res.data && res.data.data) {
          setUsers(res.data.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Utility to get initials from name
  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-16">
      <AdminNav />
      <main className="max-w-7xl mx-auto px-6 mt-8">
        {/* Header Title Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-indigo-650 font-semibold text-sm mb-1.5 uppercase tracking-wider">
            <UsersIcon className="w-4 h-4" />
            <span>Profile Registry</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            User Accounts
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            View registered user profiles and access roles (admin permission
            only).
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Retrieving user database..." />
        ) : error ? (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-2xl font-medium max-w-lg">
            ⚠️ {error}
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-3xs">
            <UsersIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500 font-medium">
              No registered users found.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((item) => {
              const isAdmin = item.role === 'admin';
              return (
                <div
                  key={item._id || item.id}
                  className="flex items-center gap-4 p-5 bg-white rounded-3xl border border-slate-200/60 shadow-xs hover:shadow-md hover:border-slate-300 transition-all duration-200"
                >
                  {/* Initials Avatar Widget */}
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-sm select-none shrink-0">
                    {getInitials(item.name)}
                  </div>

                  {/* User Meta Information */}
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-bold text-slate-900 truncate"
                        title={item.name}
                      >
                        {item.name}
                      </span>
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[9px] font-bold text-indigo-700 uppercase shrink-0">
                          <ShieldCheck className="w-2.5 h-2.5" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 rounded-full bg-slate-50 border border-slate-200 px-2 py-0.5 text-[9px] font-bold text-slate-500 uppercase shrink-0">
                          <User className="w-2.5 h-2.5" />
                          User
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate" title={item.email}>
                        {item.email}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Users;
