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
    dueDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM('Low', 'Medium', 'High'),
        allowNull: false,
        defaultValue: 'Medium'
    },
    worklog: {
        type: DataTypes.FLOAT,
    }
});

Issue.associate = (models) => {
    Issue.belongsTo(models.Project, { foreignKey: 'projectId' });
    Issue.belongsTo(models.Status, { foreignKey: 'statusId' });
    Issue.belongsTo(models.User, { foreignKey: 'assignedTo', as: 'Assignee' });
    Issue.belongsTo(models.User, { foreignKey: 'assignedBy', as: 'Reporter' });
    Issue.hasMany(models.Note, { foreignKey: 'issueId' });
};

module.exports = Issue;