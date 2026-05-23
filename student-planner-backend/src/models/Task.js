const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Task = sequelize.define('Task', {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId:      { type: DataTypes.INTEGER, allowNull: false },
  subjectId:   { type: DataTypes.INTEGER, allowNull: true },
  title:       { type: DataTypes.STRING(200), allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true },
  dueDate:     { type: DataTypes.DATEONLY, allowNull: true },
  priority:    { type: DataTypes.ENUM('low', 'medium', 'high'), defaultValue: 'medium' },
  status:      { type: DataTypes.ENUM('todo', 'in-progress', 'done'), defaultValue: 'todo' },
}, { tableName: 'tasks', timestamps: true });

module.exports = Task;
