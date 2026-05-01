import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();
  if (user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px]
                        bg-brand-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-brand-500 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/25">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">TeamFlow</span>
        </div>

        <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
          Ship faster,<br />
          <span className="text-brand-500">together.</span>
        </h1>
        <p className="text-slate-400 mb-10 text-base leading-relaxed">
          Manage projects, assign tasks, and track your team's progress — all in one place.
        </p>

        {/* Role selection cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Admin card */}
          <div className="card border-slate-700 hover:border-brand-500/50 transition-colors group">
            <div className="w-10 h-10 bg-brand-500/10 rounded-xl flex items-center justify-center mb-3 mx-auto
                            group-hover:bg-brand-500/20 transition-colors">
              <svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Admin</h3>
            <p className="text-xs text-slate-500 mb-4">Manage projects & teams</p>
            <div className="flex flex-col gap-2">
              <Link to="/admin/login" className="btn-primary text-xs py-2 text-center">Login</Link>
              <Link to="/admin/signup" className="btn-secondary text-xs py-2 text-center">Sign Up</Link>
            </div>
          </div>

          {/* Member card */}
          <div className="card border-slate-700 hover:border-emerald-500/50 transition-colors group">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center mb-3 mx-auto
                            group-hover:bg-emerald-500/20 transition-colors">
              <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-white text-sm mb-1">Member</h3>
            <p className="text-xs text-slate-500 mb-4">View & update your tasks</p>
            <div className="flex flex-col gap-2">
              <Link to="/member/login"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs py-2 rounded-xl transition-colors text-center">
                Login
              </Link>
              <Link to="/member/signup" className="btn-secondary text-xs py-2 text-center">Sign Up</Link>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-600">
          Powered by TeamFlow · Built for modern teams
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
