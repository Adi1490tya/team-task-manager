import { useAuth } from '../context/AuthContext';

const statusBadge = (status, dueDate) => {
  const today = new Date().toISOString().split('T')[0];
  const isOverdue = dueDate && dueDate < today && status !== 'done';

  if (isOverdue) return <span className="badge-overdue">Overdue</span>;
  if (status === 'done') return <span className="badge-done">Done</span>;
  if (status === 'in-progress') return <span className="badge-in-progress">In Progress</span>;
  return <span className="badge-todo">To Do</span>;
};

const TaskCard = ({ task, onStatusChange, onEdit, onDelete }) => {
  const { isAdmin } = useAuth();
  const isMyTask = task.assigned_to !== null;

  return (
    <div className="card hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="font-medium text-white text-sm leading-snug flex-1">{task.title}</h4>
        {statusBadge(task.status, task.due_date)}
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
        {task.assignee_name && (
          <span className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold">
              {task.assignee_name[0].toUpperCase()}
            </span>
            {task.assignee_name}
          </span>
        )}
        {task.due_date && (
          <span className={task.due_date < new Date().toISOString().split('T')[0] && task.status !== 'done'
            ? 'text-red-400' : ''}>
            Due {task.due_date}
          </span>
        )}
        {task.project_name && (
          <span className="text-slate-600 truncate">{task.project_name}</span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Status dropdown — admin always, member only for own tasks */}
        {(isAdmin || task.assigned_to !== undefined) && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange && onStatusChange(task.id, e.target.value)}
            className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-300
                       focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        )}

        {isAdmin && (
          <>
            {onEdit && (
              <button onClick={() => onEdit(task)}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(task.id)}
                className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
