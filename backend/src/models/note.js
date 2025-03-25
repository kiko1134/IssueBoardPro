const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Note = sequelize.define('Note', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    issueId: { type: DataTypes.INTEGER, references: { model: 'Issues', key: 'id' } },
    userId: { type: DataTypes.INTEGER, references: { model: 'Users', key: 'id' } }
});

module.exports = Note;