const { validationResult } = require('express-validator');
const { Subject } = require('../models');

exports.getAll = async (req, res, next) => {
  try {
    const subjects = await Subject.findAll({ where: { userId: req.user.id }, order: [['name', 'ASC']] });
    res.json({ subjects });
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const { name, color } = req.body;
    const subject = await Subject.create({ userId: req.user.id, name, color });
    res.status(201).json({ message: 'Subject created', subject });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json({ errors: errors.array() });

    const subject = await Subject.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    const { name, color } = req.body;
    await subject.update({ name, color });
    res.json({ message: 'Subject updated', subject });
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });
    await subject.destroy();
    res.json({ message: 'Subject deleted' });
  } catch (err) { next(err); }
};
