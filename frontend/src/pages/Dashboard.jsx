import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const StatCard = ({ label, value, color = 'blue', icon }) => {
  const colors = {
    blue:   'bg-brand-500/10 text-brand-400 border-brand-500/20',
    green:  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
    red:    'bg-red-500/10 text-red-400 border-red-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    slate:  'bg-slate-700/50 text-slate-300 border-slate-700',
  };

  return (
    <div className={`card border ${colors[color]} flex items-center gap-4`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value ?? 0}</p>
        <p className="text-xs text-slate-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const [stats, setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/dashboard/summary');
        setStats(data.data.stats);
      } catch (err) {
        setError('Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      // Refresh stats
      const { data } = await api.get('/dashboard/summary');
      setStats(data.data.stats);
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">
            Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            {isAdmin ? "Here's your team's overview." : "Here's what's on your plate."}
          </p>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6 text-red-400 text-sm">
            {error}
          </div>
        )}

        {stats && (
          <>
            {/* Stat grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {isAdmin ? (
                <>
                  <StatCard label="Total Projects" value={stats.totalProjects} color="blue"
                    icon={<ProjectIcon />} />
                  <StatCard label="Total Tasks" value={stats.totalTasks} color="slate"
                    icon={<TaskIcon />} />
                  <StatCard label="Completed" value={stats.completedTasks} color="green"
                    icon={<CheckIcon />} />
                  <StatCard label="In Progress" value={stats.inProgressTasks} color="amber"
                    icon={<ClockIcon />} />
                  <StatCard label="To Do" value={stats.todoTasks} color="purple"
                    icon={<ListIcon />} />
                  <StatCard label="Overdue" value={stats.overdueTasks} color="red"
                    icon={<AlertIcon />} />
                  <StatCard label="Team Members" value={stats.totalMembers} color="blue"
                    icon={<UsersIcon />} />
                </>
              ) : (
                <>
                  <StatCard label="My Projects" value={stats.myProjects} color="blue"
                    icon={<ProjectIcon />} />
                  <StatCard label="My Tasks" value={stats.myTasks} color="slate"
                    icon={<TaskIcon />} />
                  <StatCard label="Completed" value={stats.myCompleted} color="green"
                    icon={<CheckIcon />} />
                  <StatCard label="In Progress" value={stats.myInProgress} color="amber"
                    icon={<ClockIcon />} />
                  <StatCard label="To Do" value={stats.myTodo} color="purple"
                    icon={<ListIcon />} />
                  <StatCard label="Overdue" value={stats.myOverdue} color="red"
                    icon={<AlertIcon />} />
                </>
              )}
            </div>

            {/* Recent tasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold text-white">Recent Tasks</h2>
                <Link to="/projects" className="text-sm text-brand-400 hover:text-brand-300">
                  View all →
                </Link>
              </div>
              {stats.recentTasks?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.recentTasks.map((task) => (
                    <TaskCard key={task.id} task={task}
                      onStatusChange={!isAdmin ? handleStatusChange : undefined} />
                  ))}
                </div>
              ) : (
                <div className="card text-center py-12">
                  <p className="text-slate-500 text-sm">No tasks yet.</p>
                  {isAdmin && (
                    <Link to="/projects" className="text-brand-400 text-sm hover:underline mt-2 inline-block">
                      Create a project to get started →
                    </Link>
                  )}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
};

// Mini icons
const ProjectIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);
const TaskIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);
const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);
const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);
const AlertIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);
const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default Dashboard;
