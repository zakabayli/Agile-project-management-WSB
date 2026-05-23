const express  = require('express');
const { body } = require('express-validator');
const ctrl     = require('../controllers/taskController');
const protect  = require('../middleware/auth');

const router = express.Router();
router.use(protect);

// POST — title is required when creating
const createValidators = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('dueDate').optional({ nullable: true }).isDate().withMessage('Invalid date'),
];

// PUT — title is optional (drag-drop only sends status)
const updateValidators = [
  body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').optional().isIn(['todo', 'in-progress', 'done']).withMessage('Invalid status'),
  body('dueDate').optional({ nullable: true }).isDate().withMessage('Invalid date'),
];

router.get('/upcoming', ctrl.getUpcoming);
router.get('/',         ctrl.getAll);
router.get('/:id',      ctrl.getOne);
router.post('/',        createValidators, ctrl.create);
router.put('/:id',      updateValidators, ctrl.update);
router.delete('/:id',   ctrl.remove);

module.exports = router;
