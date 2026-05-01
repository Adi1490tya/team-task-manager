const express = require('express');
const router = express.Router();
const { adminSignup, adminLogin, memberSignup, memberLogin, getMe } = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

router.post('/admin/signup', adminSignup);
router.post('/admin/login', adminLogin);
router.post('/member/signup', memberSignup);
router.post('/member/login', memberLogin);
router.get('/me', authenticate, getMe);

module.exports = router;
