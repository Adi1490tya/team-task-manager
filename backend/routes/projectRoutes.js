const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  getAvailableMembers,
} = require('../controllers/projectController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.get('/',                               authenticate, getProjects);
router.get('/:id',                            authenticate, getProjectById);
router.post('/',                              authenticate, requireAdmin, createProject);
router.put('/:id',                            authenticate, requireAdmin, updateProject);
router.delete('/:id',                         authenticate, requireAdmin, deleteProject);
router.post('/:id/members',                   authenticate, requireAdmin, addMember);
router.delete('/:id/members/:userId',         authenticate, requireAdmin, removeMember);
router.get('/:id/members/available',          authenticate, requireAdmin, getAvailableMembers);

module.exports = router;
