import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button, Input, Select } from '../../components/UI';

const CITIES = ['Harare', 'Bulawayo', 'Mutare', 'Gweru', 'Kwekwe', 'Kadoma', 'Masvingo', 'Chinhoyi', 'Other'];

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    role: 'patient', city: 'Harare',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role, form.city);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-green-900 font-bold text-2xl">
            <span className="text-white rounded-lg p-2 text-sm font-bold leading-none" style={{ backgroundColor: '#0d2d1e' }}>Px</span>
            Pathway
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mt-4 mb-1">Create your account</h1>
          <p className="text-sm text-gray-500">Join Pathway and access safer healthcare</p>
        </div>

        <div className="card p-8">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Input
              label="Full name"
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
            <Input
              label="Email address"
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Input
              label="Confirm password"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <Select
              label="I am a..."
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="patient">Patient</option>
              <option value="pharmacy">Pharmacy</option>
              <option value="supplier">Medical Supplier</option>
              <option value="delivery_agent">Delivery Agent</option>
              <option value="provider">Healthcare Provider</option>
            </Select>
            <Select
              label="City"
              id="city"
              name="city"
              value={form.city}
              onChange={handleChange}
            >
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </Select>

            <Button type="submit" loading={loading} className="w-full mt-2">
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-green-800 font-medium hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
