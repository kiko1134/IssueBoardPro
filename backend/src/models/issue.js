const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Issue = sequelize.define('Issue', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.STRING, allowNull: false },
    projectId: { type: DataTypes.INTEGER, references: { model: 'Projects', key: 'id' } },
    assignedTo: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'id' } },
    assignedBy: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'id' } },
    dueDate: { type: DataTypes.DATE, allowNull: true }
});

module.exports = Issue;