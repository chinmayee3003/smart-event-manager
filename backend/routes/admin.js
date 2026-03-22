const express    = require('express');
const router     = express.Router();
const protect    = require('../middleware/auth');
const roleCheck  = require('../middleware/roleCheck');
const {
  getStats, getAllUsers, updateUserRole, deleteUser, getAllRegistrations
} = require('../controllers/adminController');

router.use(protect, roleCheck('admin'));

router.get('/stats',              getStats);
router.get('/users',              getAllUsers);
router.put('/users/:id/role',     updateUserRole);
router.delete('/users/:id',       deleteUser);
router.get('/registrations',      getAllRegistrations);

module.exports = router;
