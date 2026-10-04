import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input } from '../../components/UI';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'pharmacy') navigate('/pharmacy/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-green-900 font-bold text-2xl">
            <span className="text-white rounded-lg p-2 text-sm font-bold leading-none" style={{ backgroundColor: '#0d2d1e' }}>Px</span>
            Pathway
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-1">Welcome back</h1>
          <p className="text-sm text-gray-500">Log in to your Pathway account</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              prefix={<FiMail size={15} />}
              required
            />
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="relative flex items-center">
                <FiLock size={15} className="absolute left-3 text-gray-400 pointer-events-none" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-10 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:ring-2 focus:ring-green-800 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-gray-400 hover:text-gray-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
                </button>
              </div>
            </div>

            <Button type="submit" loading={loading} className="w-full">
              Log In
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800">
            <p className="font-semibold mb-2">Demo Credentials</p>
            <p><strong>Patient:</strong> patient@pathway.demo / demo1234</p>
            <p><strong>Admin:</strong> admin@pathway.demo / admin1234</p>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-800 font-medium hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
