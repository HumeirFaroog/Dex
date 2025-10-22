const express = require('express');
const { register, login, getMe, updateProfile } = require('../controllers/authController.js');
const { protect } = require('../middlewares/auth.js');
const { registerValidation, loginValidation, validate } = require('../middlewares/validator.js');
const { authLimiter } = require('../middlewares/rateLimiter.js');

const router = express.Router();

router.post('/register', authLimiter, registerValidation, validate(registerValidation), register);
router.post('/login', authLimiter, loginValidation, validate(loginValidation), login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

module.exports = router;

