const { Op, fn, col, literal } = require('sequelize');
const { validationResult } = require('express-validator');
const { Task, Subject } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const { status, priority, subjectId, from, to } = req.query;
    const where = { userId: req.user.id };

    if (status)    where.status    = status;
    if (priority)  where.priority  = priority;
    if (subjectId) where.subjectId = subjectId;
    if (from || to) {
      where.dueDate = {};
      if (from) where.dueDate[Op.gte] = from;
      if (to)   where.dueDate[Op.lte] = to;
    }

    const tasks = await Task.findAll({
      where,
      include: [{ model: Subject, as: 'subject', attributes: ['id', 'name', 'color'] }],
      order: [['dueDate', 'ASC'], ['createdAt', 'DESC']],
    });
    res.json({ tasks });
  } catch (err) { next(err); }
};

exports.getUpcoming = async (req, res, next) => {
  try {
    // Use MySQL CURDATE() so the comparison stays in the DB timezone —
    // avoids JS Date UTC-offset shifting against DATEONLY columns.
    const tasks = await Task.findAll({
      where: {
        userId: req.user.id,
        status: { [Op.ne]: 'done' },
        dueDate: {
          [Op.between]: [
            fn('CURDATE'),
            fn('DATE_ADD', fn('CURDATE'), literal('INTERVAL 7 DAY')),
          ],
        },
      },
      include: [{ model: Subject, as: 'subject', attributes: ['id', 'name', 'color'] }],
      order: [['dueDate', 'ASC']],
    });
    res.json({ tasks });
  } catch (err) { next(err); }
};

exports.getOne = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [{ model: Subject, as: 'subject', attributes: ['id', 'name', 'color'] }],
    });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ task });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { title, description, subjectId, dueDate, priority, status } = req.body;
    const task = await Task.create({
      userId: req.user.id, title, description, subjectId, dueDate, priority, status,
    });
    res.status(201).json({ message: 'Task created', task });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });

    const { title, description, subjectId, dueDate, priority, status } = req.body;
    // Only update fields that were actually sent
    const updates = {};
    if (title       !== undefined) updates.title       = title;
    if (description !== undefined) updates.description = description;
    if (subjectId   !== undefined) updates.subjectId   = subjectId;
    if (dueDate     !== undefined) updates.dueDate     = dueDate;
    if (priority    !== undefined) updates.priority    = priority;
    if (status      !== undefined) updates.status      = status;

    await task.update(updates);
    res.json({ message: 'Task updated', task });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (err) { next(err); }
};
