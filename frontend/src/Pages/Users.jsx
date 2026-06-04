import AdminNav from '../Components/AdminNav';
import { useState } from 'react';
import { useEffect } from 'react';
import http from '../api';

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
          console.log(res.data.data);
          setUsers(res.data.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <main className="max-w-6xl mx-auto p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Users
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage registered profiles (admin access only).
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 text-gray-500 font-medium">
            <span className="animate-pulse">Loading Users...</span>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            ⚠️ {error}
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-xl border border-gray-200 text-gray-400">
            No users found.
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {users.map((user) => (
              <li
                key={user._id || user.id}
                className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm flex flex-col justify-center transition hover:shadow-md"
              >
                <span className="text-base font-semibold text-gray-800">
                  {user.name}
                </span>
                <span className="text-sm text-gray-500 mt-0.5">
                  {user.email}
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Users;
