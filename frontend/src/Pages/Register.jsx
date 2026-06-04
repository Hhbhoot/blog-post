import { useState } from 'react';
import http from '../api';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '' };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: '', message: '' });

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const res = await http.post('/auth/register', formData);

      if (res.data.status !== 'success') {
        throw new Error(res.data.message);
      }

      if (res.data.data) {
        setUser(res.data.data);
        const role = res.data.data.role;
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Invalid credentials. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600">
      <div className="bg-white rounded-lg shadow-2xl p-10 w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome</h1>
          <p className="text-sm text-gray-500">Create new account</p>
        </div>

        {status.message && (
          <div
            className={`p-3 rounded-lg mb-5 text-sm font-medium transition-all  ${
              status.type === 'success'
                ? 'bg-green-100 text-green-700 border border-green-300'
                : 'bg-red-100 text-red-700 border border-red-300'
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-gray-900 mb-4"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your email"
              className="px-4 py-3 text-sm border border-gray-300 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
              disabled={isLoading}
            />
            {errors.name && (
              <span className="text-xs text-red-500 mt-1">{errors.name}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-900 mb-4"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="px-4 py-3 text-sm border border-gray-300 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
              disabled={isLoading}
            />
            {errors.email && (
              <span className="text-xs text-red-500 mt-1">{errors.email}</span>
            )}
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-900 mb-2"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-3 pr-12 text-sm border border-gray-300 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bg-none border-none cursor-pointer text-lg p-0 hover:opacity-70 transition-opacity disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-red-500 mt-1">
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg border-none cursor-pointer transition-all mt-2 ${
              isLoading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:shadow-lg hover:scale-105'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="flex justify-center items-center gap-2 mt-6 text-xs">
          <span className="text-gray-300">•</span>
          <Link
            to={'/login'}
            className="text-indigo-500 no-underline font-medium hover:text-indigo-600 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
