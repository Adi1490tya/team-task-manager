import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import ProjectCard from '../components/ProjectCard';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ProjectList = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState('');
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState({ name: '', description: '' });
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadProjects = async () => {
    try {
      const { data } = await api.get('/projects');
      setProjects(data.data.projects);
    } catch {
      setError('Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await api.post('/projects', form);
      setForm({ name: '', description: '' });
      setShowForm(false);
      loadProjects();
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project? All tasks will be removed.')) return;
    try {
      await api.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert('Failed to delete project.');
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">Projects</h1>
            <p className="text-slate-400 text-sm mt-1">
              {isAdmin ? 'All projects in your workspace.' : 'Projects you have access to.'}
            </p>
          </div>
          {isAdmin && (
            <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Project
            </button>
          )}
        </div>

        {/* Create form */}
        {isAdmin && showForm && (
          <div className="card mb-6 border-brand-500/30">
            <h2 className="font-semibold text-white mb-4">Create New Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="label">Project Name *</label>
                <input type="text" value={form.name} placeholder="e.g. Website Redesign"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="input" required />
              </div>
              <div>
                <label className="label">Description</label>
                <textarea value={form.description} placeholder="What is this project about?"
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="input resize-none" rows={3} />
              </div>
              {formError && (
                <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-xl p-3">
                  {formError}
                </p>
              )}
              <div className="flex gap-3">
                <button type="submit" disabled={submitting} className="btn-primary">
                  {submitting ? 'Creating...' : 'Create Project'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setFormError(''); }}
                  className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-xl p-4 mb-6 text-red-400 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="card text-center py-16">
            <svg className="w-12 h-12 text-slate-700 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <p className="text-slate-400 font-medium mb-1">No projects yet</p>
            <p className="text-slate-600 text-sm">
              {isAdmin ? 'Create your first project to get started.' : 'You have not been added to any projects.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard key={p.id} project={p} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default ProjectList;
