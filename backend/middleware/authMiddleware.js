const jwt = require('jsonwebtoken');
const { getDb } = require('../config/db');
const { error } = require('../utils/response');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Access denied. No token provided.', 401);
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const db = await getDb();
    const user = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(decoded.id);
    if (!user) return error(res, 'User no longer exists.', 401);
    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') return error(res, 'Token has expired. Please log in again.', 401);
    return error(res, 'Invalid token.', 401);
  }
};

module.exports = { authenticate };
