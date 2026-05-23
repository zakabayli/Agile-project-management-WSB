const express  = require('express');
const { body } = require('express-validator');
const ctrl     = require('../controllers/authController');
const protect  = require('../middleware/auth');

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], ctrl.register);

router.post('/login', [
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
], ctrl.login);

router.get('/me', protect, ctrl.getMe);

module.exports = router;
