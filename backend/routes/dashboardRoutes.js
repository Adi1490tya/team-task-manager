const express = require('express');
const router = express.Router();
const { getSummary } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/authMiddleware');

router.get('/summary', authenticate, getSummary);

module.exports = router;
