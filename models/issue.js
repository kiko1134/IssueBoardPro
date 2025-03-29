const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Issue = sequelize.define('Issue', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING(20), allowNull: false },
    description: { type: DataTypes.TEXT },
    statusId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Status', key: 'id' }
    },
    projectId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Project', key: 'id' }
    },
    assignedTo: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' }
    },
    assignedBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' }
    },
    dueDate: { type: DataTypes.DATE, allowNull: true },
    worklog: {
        type: DataTypes.FLOAT,
    }
});

module.exports = Issue;