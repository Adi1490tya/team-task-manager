const { getDb } = require('../config/db');
const { success, error } = require('../utils/response');

const isValidDate = (d) => d && !isNaN(new Date(d).getTime()) && /^\d{4}-\d{2}-\d{2}$/.test(d);

const getTasks = async (req, res) => {
  try {
    const db = await getDb();
    const { projectId } = req.query;
    let tasks;
    if (req.user.role === 'admin') {
      tasks = projectId
        ? db.prepare(`SELECT t.*, u.name AS assignee_name, p.name AS project_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id LEFT JOIN projects p ON t.project_id = p.id WHERE t.project_id = ? ORDER BY t.created_at DESC`).all(projectId)
        : db.prepare(`SELECT t.*, u.name AS assignee_name, p.name AS project_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id LEFT JOIN projects p ON t.project_id = p.id ORDER BY t.created_at DESC`).all();
    } else {
      if (projectId) {
        const mem = db.prepare('SELECT 1 FROM project_members WHERE project_id = ? AND user_id = ?').get(projectId, req.user.id);
        if (!mem) return error(res, 'Access denied to this project.', 403);
        tasks = db.prepare(`SELECT t.*, u.name AS assignee_name, p.name AS project_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id LEFT JOIN projects p ON t.project_id = p.id WHERE t.project_id = ? ORDER BY t.created_at DESC`).all(projectId);
      } else {
        tasks = db.prepare(`SELECT t.*, u.name AS assignee_name, p.name AS project_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id LEFT JOIN projects p ON t.project_id = p.id INNER JOIN project_members pm ON t.project_id = pm.project_id AND pm.user_id = ? ORDER BY t.created_at DESC`).all(req.user.id);
      }
    }
    return success(res, { tasks }, 'Tasks fetched successfully.');
  } catch (err) { console.error(err); return error(res, 'Failed to fetch tasks.', 500); }
};

const createTask = async (req, res) => {
  try {
    const db = await getDb();
    const { title, description, projectId, assignedTo, status, dueDate } = req.body;
    if (!title || title.trim().length < 2) return error(res, 'Task title must be at least 2 characters.', 400);
    if (!projectId) return error(res, 'projectId is required.', 400);
    if (!db.prepare('SELECT id FROM projects WHERE id = ?').get(projectId)) return error(res, 'Project not found.', 404);
    if (assignedTo) {
      const mem = db.prepare('SELECT 1 FROM project_members WHERE project_id = ? AND user_id = ?').get(projectId, assignedTo);
      if (!mem) return error(res, 'Assigned user is not a member of this project.', 400);
    }
    if (dueDate && !isValidDate(dueDate)) return error(res, 'Invalid due date format. Use YYYY-MM-DD.', 400);
    const validStatuses = ['todo', 'in-progress', 'done'];
    const taskStatus = status && validStatuses.includes(status) ? status : 'todo';
    const result = db.prepare(`INSERT INTO tasks (title, description, project_id, assigned_to, status, due_date) VALUES (?, ?, ?, ?, ?, ?)`)
      .run(title.trim(), description?.trim() || null, projectId, assignedTo || null, taskStatus, dueDate || null);
    const task = db.prepare(`SELECT t.*, u.name AS assignee_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.id = ?`).get(result.lastInsertRowid);
    return success(res, { task }, 'Task created successfully.', 201);
  } catch (err) { console.error(err); return error(res, 'Failed to create task.', 500); }
};

const updateTask = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { title, description, assignedTo, status, dueDate } = req.body;
    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!task) return error(res, 'Task not found.', 404);
    const validStatuses = ['todo', 'in-progress', 'done'];
    if (req.user.role === 'member') {
      if (task.assigned_to !== req.user.id) return error(res, 'Access denied. You can only update tasks assigned to you.', 403);
      if (!status) return error(res, 'Members can only update task status.', 400);
      if (!validStatuses.includes(status)) return error(res, 'Invalid status.', 400);
      db.prepare('UPDATE tasks SET status = ? WHERE id = ?').run(status, id);
    } else {
      if (title && title.trim().length < 2) return error(res, 'Task title must be at least 2 characters.', 400);
      if (dueDate && !isValidDate(dueDate)) return error(res, 'Invalid due date format. Use YYYY-MM-DD.', 400);
      if (assignedTo != null) {
        const mem = db.prepare('SELECT 1 FROM project_members WHERE project_id = ? AND user_id = ?').get(task.project_id, assignedTo);
        if (!mem) return error(res, 'Assigned user is not a member of this project.', 400);
      }
      const newStatus = status && validStatuses.includes(status) ? status : task.status;
      db.prepare(`UPDATE tasks SET title=?, description=?, assigned_to=?, status=?, due_date=? WHERE id=?`)
        .run(title?.trim() || task.title, description !== undefined ? (description?.trim() || null) : task.description, assignedTo !== undefined ? (assignedTo || null) : task.assigned_to, newStatus, dueDate !== undefined ? (dueDate || null) : task.due_date, id);
    }
    const updated = db.prepare(`SELECT t.*, u.name AS assignee_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.id = ?`).get(id);
    return success(res, { task: updated }, 'Task updated successfully.');
  } catch (err) { console.error(err); return error(res, 'Failed to update task.', 500); }
};

const deleteTask = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    if (!db.prepare('SELECT id FROM tasks WHERE id = ?').get(id)) return error(res, 'Task not found.', 404);
    db.prepare('DELETE FROM tasks WHERE id = ?').run(id);
    return success(res, {}, 'Task deleted successfully.');
  } catch (err) { console.error(err); return error(res, 'Failed to delete task.', 500); }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
