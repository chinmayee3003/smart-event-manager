const express   = require('express');
const router    = express.Router();
const protect   = require('../middleware/auth');
const { getDashboard, getProfile, updateProfile } = require('../controllers/userController');

router.get('/dashboard', protect, getDashboard);
router.get('/profile',   protect, getProfile);
router.put('/profile',   protect, updateProfile);

module.exports = router;
