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

module.exports = User;