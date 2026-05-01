import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProjectCard = ({ project, onDelete }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="card hover:border-slate-700 transition-all hover:-translate-y-0.5 group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-base truncate">{project.name}</h3>
          <p className="text-xs text-slate-500 mt-0.5">by {project.creator_name}</p>
        </div>
        {isAdmin && (
          <button onClick={() => onDelete && onDelete(project.id)}
            className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-900/20 rounded-lg
                       transition-colors opacity-0 group-hover:opacity-100">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      {project.description && (
        <p className="text-sm text-slate-400 mb-4 line-clamp-2">{project.description}</p>
      )}

      <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {project.member_count ?? 0} members
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          {project.task_count ?? 0} tasks
        </span>
      </div>

      <Link to={`/projects/${project.id}`}
        className="btn-secondary text-sm w-full text-center block">
        View Project →
      </Link>
    </div>
  );
};

export default ProjectCard;
