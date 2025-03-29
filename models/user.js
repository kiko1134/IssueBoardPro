const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(20), allowNull: false
    },
    email: {
        type: DataTypes.STRING(30), allowNull: false, unique: true
    },
    password: {
        type: DataTypes.STRING(20), allowNull: false
    }
});

User.associate = (models) => {
    User.hasMany(models.Issue, { foreignKey: 'assignedTo', as: 'AssignedIssues' });
    User.hasMany(models.Issue, { foreignKey: 'assignedBy', as: 'ReportedIssues' });
    User.hasMany(models.Note, { foreignKey: 'userId' });
};

module.exports = User;