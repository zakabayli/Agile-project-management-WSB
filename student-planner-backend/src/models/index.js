const sequelize = require('../config/database');
const User    = require('./User');
const Subject = require('./Subject');
const Task    = require('./Task');

// Associations
User.hasMany(Subject, { foreignKey: 'userId', onDelete: 'CASCADE' });
Subject.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Task, { foreignKey: 'userId', onDelete: 'CASCADE' });
Task.belongsTo(User, { foreignKey: 'userId' });

Subject.hasMany(Task, { foreignKey: 'subjectId', onDelete: 'SET NULL' });
Task.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });

module.exports = { sequelize, User, Subject, Task };
