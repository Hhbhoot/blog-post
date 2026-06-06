import { useState } from 'react';
import http from '../api';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';

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

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
      isValid = false;
    }

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
        localStorage.setItem('authToken', res.data.token);
        if (role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: err.message || 'Registration failed. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-slate-950 text-slate-100 overflow-hidden select-none">
      {/* Dynamic Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none animate-pulse duration-[8s]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px] pointer-events-none animate-pulse duration-[10s]" />

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md mx-4 p-8 sm:p-10 rounded-3xl border border-white/10 bg-slate-900/40 backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-[0_0_15px_rgba(99,102,241,0.4)] mb-4">
            <span className="text-xl font-bold text-white">B</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Get started with BlogSpace today
          </p>
        </div>

        {status.message && (
          <div
            className={`p-4 rounded-2xl mb-6 text-sm font-medium border transition-all ${
              status.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
            }`}
          >
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="name"
              className="text-xs font-semibold text-slate-300 tracking-wide uppercase"
            >
              Full Name
            </label>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-5 h-5 text-slate-500" />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 disabled:opacity-50"
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <span className="text-xs text-rose-400 font-medium mt-1">
                {errors.name}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="email"
              className="text-xs font-semibold text-slate-300 tracking-wide uppercase"
            >
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-slate-500" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-3 bg-slate-950/40 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 disabled:opacity-50"
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <span className="text-xs text-rose-400 font-medium mt-1">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label
              htmlFor="password"
              className="text-xs font-semibold text-slate-300 tracking-wide uppercase"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full pl-12 pr-12 py-3 bg-slate-950/40 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 disabled:opacity-50"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs text-rose-400 font-medium mt-1">
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="group w-full py-3.5 px-4 text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(99,102,241,0.3)]"
            disabled={isLoading}
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
            {!isLoading && (
              <UserPlus className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            )}
          </button>
        </form>

        <div className="flex justify-center items-center gap-2 mt-8 text-xs text-slate-400 border-t border-white/5 pt-6">
          <span>Already have an account?</span>
          <Link
            to={'/login'}
            className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </main>
  );
};

export default RegisterPage;
