const express = require('express');
const ctrl    = require('../controllers/dashboardController');
const protect = require('../middleware/auth');

const router = express.Router();
router.get('/stats', protect, ctrl.getStats);

module.exports = router;
