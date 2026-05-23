const express  = require('express');
const { body } = require('express-validator');
const ctrl     = require('../controllers/subjectController');
const protect  = require('../middleware/auth');

const router = express.Router();
router.use(protect);

const validators = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('color').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Color must be a hex code'),
];

router.get('/',         ctrl.getAll);
router.post('/',        validators, ctrl.create);
router.put('/:id',      validators, ctrl.update);
router.delete('/:id',   ctrl.remove);

module.exports = router;
