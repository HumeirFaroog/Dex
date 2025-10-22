const express = require('express');
const { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getDashboardStats,
  getHealthTrends
} = require('../controllers/userController.js');
const { protect, authorize } = require('../middlewares/auth.js');

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/trends', getHealthTrends);

// Admin only routes
router.get('/', authorize('admin', 'doctor'), getUsers);
router.get('/:id', authorize('admin', 'doctor'), getUserById);
router.put('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;

