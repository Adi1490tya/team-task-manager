const { getDb } = require('../config/db');
const { success, error } = require('../utils/response');

const getProjects = async (req, res) => {
  try {
    const db = await getDb();
    let projects;
    if (req.user.role === 'admin') {
      projects = db.prepare(`
        SELECT p.*, u.name AS creator_name,
               COUNT(DISTINCT pm.user_id) AS member_count,
               COUNT(DISTINCT t.id) AS task_count
        FROM projects p
        LEFT JOIN users u ON p.created_by = u.id
        LEFT JOIN project_members pm ON p.id = pm.project_id
        LEFT JOIN tasks t ON p.id = t.project_id
        GROUP BY p.id ORDER BY p.created_at DESC
      `).all();
    } else {
      projects = db.prepare(`
        SELECT p.*, u.name AS creator_name,
               COUNT(DISTINCT pm2.user_id) AS member_count,
               COUNT(DISTINCT t.id) AS task_count
        FROM projects p
        INNER JOIN project_members pm ON p.id = pm.project_id AND pm.user_id = ?
        LEFT JOIN users u ON p.created_by = u.id
        LEFT JOIN project_members pm2 ON p.id = pm2.project_id
        LEFT JOIN tasks t ON p.id = t.project_id
        GROUP BY p.id ORDER BY p.created_at DESC
      `).all(req.user.id);
    }
    return success(res, { projects }, 'Projects fetched successfully.');
  } catch (err) { console.error(err); return error(res, 'Failed to fetch projects.', 500); }
};

const getProjectById = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const project = db.prepare(`
      SELECT p.*, u.name AS creator_name FROM projects p
      LEFT JOIN users u ON p.created_by = u.id WHERE p.id = ?
    `).get(id);
    if (!project) return error(res, 'Project not found.', 404);
    if (req.user.role === 'member') {
      const mem = db.prepare('SELECT 1 FROM project_members WHERE project_id = ? AND user_id = ?').get(id, req.user.id);
      if (!mem) return error(res, 'Access denied. You are not a member of this project.', 403);
    }
    const members = db.prepare(`
      SELECT u.id, u.name, u.email, u.role FROM users u
      INNER JOIN project_members pm ON u.id = pm.user_id WHERE pm.project_id = ?
    `).all(id);
    const tasks = db.prepare(`
      SELECT t.*, u.name AS assignee_name FROM tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.project_id = ? ORDER BY t.created_at DESC
    `).all(id);
    return success(res, { project: { ...project, members, tasks } }, 'Project fetched successfully.');
  } catch (err) { console.error(err); return error(res, 'Failed to fetch project.', 500); }
};

const createProject = async (req, res) => {
  try {
    const db = await getDb();
    const { name, description } = req.body;
    if (!name || name.trim().length < 2) return error(res, 'Project name must be at least 2 characters.', 400);
    const result = db.prepare('INSERT INTO projects (name, description, created_by) VALUES (?, ?, ?)')
      .run(name.trim(), description?.trim() || null, req.user.id);
    const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(result.lastInsertRowid);
    return success(res, { project }, 'Project created successfully.', 201);
  } catch (err) { console.error(err); return error(res, 'Failed to create project.', 500); }
};

const updateProject = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { name, description } = req.body;
    if (!db.prepare('SELECT id FROM projects WHERE id = ?').get(id)) return error(res, 'Project not found.', 404);
    if (!name || name.trim().length < 2) return error(res, 'Project name must be at least 2 characters.', 400);
    db.prepare('UPDATE projects SET name = ?, description = ? WHERE id = ?')
      .run(name.trim(), description?.trim() || null, id);
    const updated = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
    return success(res, { project: updated }, 'Project updated successfully.');
  } catch (err) { console.error(err); return error(res, 'Failed to update project.', 500); }
};

const deleteProject = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    if (!db.prepare('SELECT id FROM projects WHERE id = ?').get(id)) return error(res, 'Project not found.', 404);
    db.prepare('DELETE FROM projects WHERE id = ?').run(id);
    return success(res, {}, 'Project deleted successfully.');
  } catch (err) { console.error(err); return error(res, 'Failed to delete project.', 500); }
};

const addMember = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { userId } = req.body;
    if (!userId) return error(res, 'userId is required.', 400);
    if (!db.prepare('SELECT id FROM projects WHERE id = ?').get(id)) return error(res, 'Project not found.', 404);
    if (!db.prepare('SELECT id FROM users WHERE id = ?').get(userId)) return error(res, 'User not found.', 404);
    if (db.prepare('SELECT 1 FROM project_members WHERE project_id = ? AND user_id = ?').get(id, userId))
      return error(res, 'User is already a member of this project.', 409);
    db.prepare('INSERT INTO project_members (project_id, user_id) VALUES (?, ?)').run(id, userId);
    return success(res, {}, 'Member added to project successfully.', 201);
  } catch (err) { console.error(err); return error(res, 'Failed to add member.', 500); }
};

const removeMember = async (req, res) => {
  try {
    const db = await getDb();
    const { id, userId } = req.params;
    if (!db.prepare('SELECT id FROM projects WHERE id = ?').get(id)) return error(res, 'Project not found.', 404);
    if (!db.prepare('SELECT 1 FROM project_members WHERE project_id = ? AND user_id = ?').get(id, userId))
      return error(res, 'User is not a member of this project.', 404);
    db.prepare('DELETE FROM project_members WHERE project_id = ? AND user_id = ?').run(id, userId);
    return success(res, {}, 'Member removed from project successfully.');
  } catch (err) { console.error(err); return error(res, 'Failed to remove member.', 500); }
};

const getAvailableMembers = async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    if (!db.prepare('SELECT id FROM projects WHERE id = ?').get(id)) return error(res, 'Project not found.', 404);
    const members = db.prepare(`
      SELECT id, name, email FROM users
      WHERE role = 'member' AND id NOT IN (
        SELECT user_id FROM project_members WHERE project_id = ?
      ) ORDER BY name ASC
    `).all(id);
    return success(res, { members }, 'Available members fetched.');
  } catch (err) { console.error(err); return error(res, 'Failed to fetch available members.', 500); }
};

module.exports = { getProjects, getProjectById, createProject, updateProject, deleteProject, addMember, removeMember, getAvailableMembers };
