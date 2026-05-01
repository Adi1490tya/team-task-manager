const { getDb } = require('../config/db');
const { success, error } = require('../utils/response');

const getSummary = async (req, res) => {
  try {
    const db = await getDb();
    const today = new Date().toISOString().split('T')[0];
    let stats;
    if (req.user.role === 'admin') {
      stats = {
        totalProjects:  db.prepare('SELECT COUNT(*) AS c FROM projects').get().c,
        totalTasks:     db.prepare('SELECT COUNT(*) AS c FROM tasks').get().c,
        completedTasks: db.prepare("SELECT COUNT(*) AS c FROM tasks WHERE status='done'").get().c,
        inProgressTasks:db.prepare("SELECT COUNT(*) AS c FROM tasks WHERE status='in-progress'").get().c,
        todoTasks:      db.prepare("SELECT COUNT(*) AS c FROM tasks WHERE status='todo'").get().c,
        overdueTasks:   db.prepare("SELECT COUNT(*) AS c FROM tasks WHERE due_date < ? AND status!='done'").get(today).c,
        totalMembers:   db.prepare("SELECT COUNT(*) AS c FROM users WHERE role='member'").get().c,
        recentTasks:    db.prepare(`SELECT t.id, t.title, t.status, t.due_date, t.project_id, p.name AS project_name, u.name AS assignee_name FROM tasks t LEFT JOIN projects p ON t.project_id=p.id LEFT JOIN users u ON t.assigned_to=u.id ORDER BY t.created_at DESC LIMIT 5`).all(),
      };
    } else {
      stats = {
        myProjects:   db.prepare('SELECT COUNT(DISTINCT project_id) AS c FROM project_members WHERE user_id=?').get(req.user.id).c,
        myTasks:      db.prepare('SELECT COUNT(*) AS c FROM tasks WHERE assigned_to=?').get(req.user.id).c,
        myCompleted:  db.prepare("SELECT COUNT(*) AS c FROM tasks WHERE assigned_to=? AND status='done'").get(req.user.id).c,
        myInProgress: db.prepare("SELECT COUNT(*) AS c FROM tasks WHERE assigned_to=? AND status='in-progress'").get(req.user.id).c,
        myTodo:       db.prepare("SELECT COUNT(*) AS c FROM tasks WHERE assigned_to=? AND status='todo'").get(req.user.id).c,
        myOverdue:    db.prepare("SELECT COUNT(*) AS c FROM tasks WHERE assigned_to=? AND due_date < ? AND status!='done'").get(req.user.id, today).c,
        recentTasks:  db.prepare(`SELECT t.id, t.title, t.status, t.due_date, t.project_id, p.name AS project_name FROM tasks t LEFT JOIN projects p ON t.project_id=p.id WHERE t.assigned_to=? ORDER BY t.created_at DESC LIMIT 5`).all(req.user.id),
      };
    }
    return success(res, { stats }, 'Dashboard summary fetched successfully.');
  } catch (err) { console.error(err); return error(res, 'Failed to fetch dashboard summary.', 500); }
};

module.exports = { getSummary };
