const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Project = sequelize.define('Project', {
    id: {
        type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true
    },
    name: {
        type: DataTypes.STRING(40), allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
});

Project.associate = (models) => {
    Project.hasMany(models.Issue, { foreignKey: 'projectId' });
};

module.exports = Project;