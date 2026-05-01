const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');
const { authenticate } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/roleMiddleware');

router.get('/',        authenticate, getTasks);
router.post('/',       authenticate, requireAdmin, createTask);
router.put('/:id',     authenticate, updateTask);       // both roles, logic inside
router.delete('/:id',  authenticate, requireAdmin, deleteTask);

module.exports = router;
