const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Status = sequelize.define('Status', {
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING(15),
        allowNull: false,
        unique: true
    }
}, {
    tableName: 'Status',
    timestamps: false
});

module.exports = Status;
