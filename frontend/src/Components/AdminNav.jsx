import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import http from '../api';

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

  return (
    <nav className="bg-white border-b p-4 mb-6">
      <div className="max-w-6xl mx-auto flex items-center gap-4">
        <Link
          to="/admin"
          className="text-sm font-medium text-gray-700 hover:text-indigo-600"
        >
          Dashboard
        </Link>
        <Link
          to="/admin/users"
          className="text-sm font-medium text-gray-700 hover:text-indigo-600"
        >
          Users
        </Link>
        <Link
          to="/admin/posts"
          className="text-sm font-medium text-gray-700 hover:text-indigo-600"
        >
          Posts
        </Link>
        <Link
          to="/admin/posts/create"
          className="text-sm font-medium text-white bg-indigo-600 px-3 py-1 rounded hover:bg-indigo-700"
        >
          Create Post
        </Link>
        <button
          type="button"
          disabled={logoutLoading}
          onClick={handleLogout}
          className="text-sm font-medium text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
        >
          {logoutLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </nav>
  );
};

export default AdminNav;
