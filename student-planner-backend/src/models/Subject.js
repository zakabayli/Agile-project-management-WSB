const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Subject = sequelize.define('Subject', {
  id:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  name:   { type: DataTypes.STRING(100), allowNull: false },
  color:  { type: DataTypes.STRING(7), defaultValue: '#6366f1',
            validate: { is: /^#[0-9A-Fa-f]{6}$/ } },
}, { tableName: 'subjects', timestamps: true });

module.exports = Subject;
