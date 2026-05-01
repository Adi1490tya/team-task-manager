const { error } = require('../utils/response');

const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return error(res, 'Access denied. Admin privileges required.', 403);
  }
  next();
};

const requireMember = (req, res, next) => {
  if (!req.user || !['admin', 'member'].includes(req.user.role)) {
    return error(res, 'Access denied.', 403);
  }
  next();
};

module.exports = { requireAdmin, requireMember };
