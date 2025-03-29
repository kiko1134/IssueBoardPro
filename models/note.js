const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Note = sequelize.define('Note', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    issueId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Issue', key: 'id' }
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'User', key: 'id' }
    }
});

Note.associate = (models) => {
    Note.belongsTo(models.Issue, { foreignKey: 'issueId' });
    Note.belongsTo(models.User, { foreignKey: 'userId' });
};

module.exports = Note;