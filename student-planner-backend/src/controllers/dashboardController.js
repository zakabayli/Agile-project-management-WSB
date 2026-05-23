const { Op, fn, col, literal } = require('sequelize');
const { Task, Subject } = require('../models');

exports.getStats = async (req, res, next) => {
  try {
    const uid = req.user.id;

    const [total, dueToday, doneThisWeek, bySubject] = await Promise.all([

      // Total tasks for this user
      Task.count({
        where: { userId: uid },
      }),

      // Due today — CURDATE() matches DATEONLY column exactly, no timezone drift
      Task.count({
        where: {
          userId:  uid,
          status:  { [Op.ne]: 'done' },
          dueDate: fn('CURDATE'),
        },
      }),

      // Done this week — Monday 00:00 to now
      // DATE_SUB(CURDATE(), INTERVAL WEEKDAY(CURDATE()) DAY) = this Monday
      Task.count({
        where: {
          userId: uid,
          status: 'done',
          updatedAt: {
            [Op.gte]: fn(
              'DATE_SUB',
              fn('CURDATE'),
              literal('INTERVAL WEEKDAY(CURDATE()) DAY')
            ),
          },
        },
      }),

      // Tasks grouped by subject
      Task.findAll({
        where: { userId: uid },
        attributes: [
          'subjectId',
          [fn('COUNT', col('Task.id')), 'count'],
        ],
        include: [{
          model:      Subject,
          as:         'subject',
          attributes: ['name', 'color'],
          required:   false,
        }],
        group: ['subjectId', 'subject.id', 'subject.name', 'subject.color'],
        order: [[literal('count'), 'DESC']],
        raw: false,
      }),
    ]);

    res.json({ total, dueToday, doneThisWeek, bySubject });
  } catch (err) { next(err); }
};
