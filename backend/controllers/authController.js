const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const { getDb } = require('../config/db');
const { success, error } = require('../utils/response');

const generateToken = (user) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const validateSignupInput = ({ name, email, password }) => {
  const errors = [];
  if (!name || name.trim().length < 2) errors.push('Name must be at least 2 characters.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required.');
  if (!password || password.length < 6) errors.push('Password must be at least 6 characters.');
  return errors;
};

const signup = (role) => async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const errs = validateSignupInput({ name, email, password });
    if (errs.length) return error(res, 'Validation failed.', 400, errs);
    const db = await getDb();
    if (db.prepare('SELECT id FROM users WHERE email = ?').get(email.toLowerCase()))
      return error(res, 'An account with this email already exists.', 409);
    const hashed = await bcrypt.hash(password, 12);
    const result = db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)')
      .run(name.trim(), email.toLowerCase(), hashed, role);
    const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?')
      .get(result.lastInsertRowid);
    return success(res, { user, token: generateToken(user) }, `${role} account created.`, 201);
  } catch (err) {
    console.error('signup error:', err);
    return error(res, 'Server error during signup.', 500);
  }
};

const login = (role) => async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return error(res, 'Email and password are required.', 400);
    const db = await getDb();
    const user = db.prepare('SELECT * FROM users WHERE email = ? AND role = ?').get(email.toLowerCase(), role);
    if (!user) return error(res, `Invalid credentials or not a ${role} account.`, 401);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return error(res, 'Invalid credentials.', 401);
    const { password: _, ...safeUser } = user;
    return success(res, { user: safeUser, token: generateToken(safeUser) }, `${role} login successful.`);
  } catch (err) {
    console.error('login error:', err);
    return error(res, 'Server error during login.', 500);
  }
};

const getMe = (req, res) => success(res, { user: req.user }, 'Authenticated user fetched.');

module.exports = {
  adminSignup:  signup('admin'),
  adminLogin:   login('admin'),
  memberSignup: signup('member'),
  memberLogin:  login('member'),
  getMe,
};
