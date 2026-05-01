import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const AuthForm = ({ role, mode }) => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const isSignup = mode === 'signup';

  const [form, setForm]     = useState({ name: '', email: '', password: '' });
  const [error, setError]   = useState('');
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const isAdmin = role === 'admin';
  const accentClass = isAdmin ? 'bg-brand-500 hover:bg-brand-600 shadow-brand-500/25' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/25';
  const borderAccent = isAdmin ? 'focus:border-brand-500 focus:ring-brand-500' : 'focus:border-emerald-500 focus:ring-emerald-500';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setErrors([]);
    setLoading(true);

    try {
      const endpoint = `/auth/${role}/${mode}`;
      const payload  = isSignup ? form : { email: form.email, password: form.password };
      const { data } = await api.post(endpoint, payload);

      login(data.data.user, data.data.token);
      navigate('/dashboard');
    } catch (err) {
      const msg  = err.response?.data?.message || 'Something went wrong.';
      const errs = err.response?.data?.errors  || [];
      setError(msg);
      setErrors(errs);
    } finally {
      setLoading(false);
    }
  };

  const oppositeMode = isSignup ? 'login' : 'signup';
  const oppositePath = `/${role}/${oppositeMode}`;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl
          ${isAdmin ? 'bg-brand-500/5' : 'bg-emerald-500/5'}`} />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        {/* Back */}
        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-300
                                transition-colors mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4
            ${isAdmin ? 'bg-brand-500/10' : 'bg-emerald-500/10'}`}>
            {isAdmin ? (
              <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            )}
          </div>
          <h1 className="text-2xl font-bold text-white">
            {isSignup ? 'Create account' : 'Welcome back'}
          </h1>
          <p className="text-sm text-slate-400 mt-1 capitalize">
            {role} {isSignup ? 'registration' : 'login'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="label">Full Name</label>
              <input type="text" placeholder="Jane Smith"
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`input ${borderAccent}`} required />
            </div>
          )}
          <div>
            <label className="label">Email</label>
            <input type="email" placeholder="you@example.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`input ${borderAccent}`} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input type="password" placeholder={isSignup ? 'Min. 6 characters' : '••••••••'}
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
              className={`input ${borderAccent}`} required />
          </div>

          {/* Errors */}
          {error && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-3">
              <p className="text-sm text-red-400">{error}</p>
              {errors.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {errors.map((e, i) => (
                    <li key={i} className="text-xs text-red-400">• {e}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button type="submit" disabled={loading}
            className={`w-full text-white font-semibold py-2.5 rounded-xl transition-all
                        shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${accentClass}`}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {isSignup ? 'Creating account...' : 'Signing in...'}
              </span>
            ) : (
              isSignup ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          {' '}
          <Link to={oppositePath} className={`font-medium ${isAdmin ? 'text-brand-400 hover:text-brand-300' : 'text-emerald-400 hover:text-emerald-300'}`}>
            {isSignup ? 'Sign in' : 'Sign up'}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
