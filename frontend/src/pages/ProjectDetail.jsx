import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import TaskCard from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [project, setProject]         = useState(null);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState('');
  const [availableMembers, setAvailableMembers] = useState([]);
  const [selectedMember, setSelectedMember]     = useState('');
  const [addingMember, setAddingMember]         = useState(false);
  const [memberError, setMemberError]           = useState('');

  // Task form state
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask]   = useState(null);
  const [taskForm, setTaskForm]         = useState({
    title: '', description: '', assignedTo: '', status: 'todo', dueDate: ''
  });
  const [taskFormError, setTaskFormError] = useState('');
  const [savingTask, setSavingTask]       = useState(false);

  const loadProject = async () => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      setProject(data.data.project);
    } catch (err) {
      if (err.response?.status === 404) setError('Project not found.');
      else if (err.response?.status === 403) setError('Access denied.');
      else setError('Failed to load project.');
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableMembers = async () => {
    if (!isAdmin) return;
    try {
      const { data } = await api.get(`/projects/${id}/members/available`);
      setAvailableMembers(data.data.members);
    } catch {}
  };

  useEffect(() => {
    loadProject();
    loadAvailableMembers();
  }, [id]);

  const handleAddMember = async () => {
    if (!selectedMember) return;
    setMemberError('');
    setAddingMember(true);
    try {
      await api.post(`/projects/${id}/members`, { userId: selectedMember });
      setSelectedMember('');
      await loadProject();
      await loadAvailableMembers();
    } catch (err) {
      setMemberError(err.response?.data?.message || 'Failed to add member.');
    } finally {
      setAddingMember(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member from the project?')) return;
    try {
      await api.delete(`/projects/${id}/members/${userId}`);
      await loadProject();
      await loadAvailableMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove member.');
    }
  };

  const openTaskForm = (task = null) => {
    setEditingTask(task);
    setTaskForm(task ? {
      title: task.title,
      description: task.description || '',
      assignedTo: task.assigned_to || '',
      status: task.status,
      dueDate: task.due_date || ''
    } : { title: '', description: '', assignedTo: '', status: 'todo', dueDate: '' });
    setTaskFormError('');
    setShowTaskForm(true);
  };

  const handleTaskSubmit = async (e) => {
    e.preventDefault();
    setTaskFormError('');
    setSavingTask(true);
    try {
      const payload = {
        title: taskForm.title,
        description: taskForm.description || undefined,
        projectId: parseInt(id),
        assignedTo: taskForm.assignedTo ? parseInt(taskForm.assignedTo) : undefined,
        status: taskForm.status,
        dueDate: taskForm.dueDate || undefined,
      };
      if (editingTask) {
        await api.put(`/tasks/${editingTask.id}`, payload);
      } else {
        await api.post('/tasks', payload);
      }
      setShowTaskForm(false);
      setEditingTask(null);
      await loadProject();
    } catch (err) {
      setTaskFormError(err.response?.data?.message || 'Failed to save task.');
    } finally {
      setSavingTask(false);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      await loadProject();
    } catch {
      alert('Failed to delete task.');
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}`, { status });
      await loadProject();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update status.');
    }
  };

  if (loading) return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </>
  );

  if (error) return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="card text-center py-16">
          <p className="text-slate-400">{error}</p>
          <button onClick={() => navigate('/projects')} className="btn-secondary mt-4">← Back to Projects</button>
        </div>
      </div>
    </>
  );

  const tasks = project?.tasks || [];
  const members = project?.members || [];
  const todo       = tasks.filter(t => t.status === 'todo');
  const inProgress = tasks.filter(t => t.status === 'in-progress');
  const done       = tasks.filter(t => t.status === 'done');

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6 gap-4">
          <div>
            <button onClick={() => navigate('/projects')}
              className="text-sm text-slate-500 hover:text-slate-300 flex items-center gap-1 mb-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Projects
            </button>
            <h1 className="text-2xl font-bold text-white">{project.name}</h1>
            {project.description && (
              <p className="text-slate-400 text-sm mt-1">{project.description}</p>
            )}
          </div>
          {isAdmin && (
            <button onClick={() => openTaskForm()} className="btn-primary shrink-0 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Task
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left: Members panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="card">
              <h2 className="font-semibold text-white text-sm mb-4">Team Members</h2>
              {members.length === 0 ? (
                <p className="text-xs text-slate-500">No members yet.</p>
              ) : (
                <ul className="space-y-2">
                  {members.map((m) => (
                    <li key={m.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0
                          ${m.role === 'admin' ? 'bg-brand-500' : 'bg-emerald-600'} text-white`}>
                          {m.name[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-white truncate">{m.name}</p>
                          <p className="text-[10px] text-slate-500 capitalize">{m.role}</p>
                        </div>
                      </div>
                      {isAdmin && (
                        <button onClick={() => handleRemoveMember(m.id)}
                          className="text-slate-600 hover:text-red-400 transition-colors shrink-0">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {/* Add member */}
              {isAdmin && availableMembers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-800">
                  <label className="label text-xs">Add Member</label>
                  <select value={selectedMember} onChange={(e) => setSelectedMember(e.target.value)}
                    className="input text-xs mb-2">
                    <option value="">Select member...</option>
                    {availableMembers.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                  {memberError && <p className="text-xs text-red-400 mb-2">{memberError}</p>}
                  <button onClick={handleAddMember} disabled={!selectedMember || addingMember}
                    className="btn-primary text-xs w-full py-1.5">
                    {addingMember ? 'Adding...' : 'Add to Project'}
                  </button>
                </div>
              )}
              {isAdmin && availableMembers.length === 0 && members.length > 0 && (
                <p className="text-xs text-slate-600 mt-4 pt-4 border-t border-slate-800">
                  All members added.
                </p>
              )}
            </div>
          </div>

          {/* Right: Kanban columns */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'To Do', tasks: todo, color: 'text-slate-400', dot: 'bg-slate-500' },
              { label: 'In Progress', tasks: inProgress, color: 'text-amber-400', dot: 'bg-amber-500' },
              { label: 'Done', tasks: done, color: 'text-emerald-400', dot: 'bg-emerald-500' },
            ].map(({ label, tasks: colTasks, color, dot }) => (
              <div key={label}>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full ${dot}`} />
                  <span className={`text-sm font-medium ${color}`}>{label}</span>
                  <span className="text-xs text-slate-600 bg-slate-800 rounded-full px-2 py-0.5">
                    {colTasks.length}
                  </span>
                </div>
                <div className="space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-800 rounded-2xl p-6 text-center">
                      <p className="text-xs text-slate-600">No tasks</p>
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <TaskCard key={task.id} task={task}
                        onStatusChange={handleStatusChange}
                        onEdit={isAdmin ? openTaskForm : undefined}
                        onDelete={isAdmin ? handleDeleteTask : undefined} />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="card w-full max-w-md border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-white">
                  {editingTask ? 'Edit Task' : 'New Task'}
                </h2>
                <button onClick={() => { setShowTaskForm(false); setEditingTask(null); }}
                  className="text-slate-500 hover:text-white">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleTaskSubmit} className="space-y-4">
                <div>
                  <label className="label">Title *</label>
                  <input type="text" value={taskForm.title} placeholder="Task title"
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="input" required />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea value={taskForm.description} placeholder="Optional details..."
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="input resize-none" rows={2} />
                </div>
                <div>
                  <label className="label">Assign To</label>
                  <select value={taskForm.assignedTo}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedTo: e.target.value })}
                    className="input">
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Status</label>
                    <select value={taskForm.status}
                      onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                      className="input">
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                  <div>
                    <label className="label">Due Date</label>
                    <input type="date" value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className="input" />
                  </div>
                </div>
                {taskFormError && (
                  <p className="text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-xl p-3">
                    {taskFormError}
                  </p>
                )}
                <div className="flex gap-3 pt-1">
                  <button type="submit" disabled={savingTask} className="btn-primary flex-1">
                    {savingTask ? 'Saving...' : editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button type="button" onClick={() => { setShowTaskForm(false); setEditingTask(null); }}
                    className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default ProjectDetail;
