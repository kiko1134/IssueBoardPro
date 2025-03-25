const sequelize = require('../config/database'); // Взима конфигурацията на базата
const User = require('./user'); // Импортира модела User
const Project = require('./project'); // Импортира модела Project
const Issue = require('./issue'); // Импортира модела Issue
const Note = require('./note'); // Импортира модела Note

User.hasMany(Issue, { foreignKey: 'assignedTo', as: 'AssignedIssues' });
User.hasMany(Issue, { foreignKey: 'assignedBy', as: 'CreatedIssues' });
Project.hasMany(Issue, { foreignKey: 'projectId', as: 'ProjectIssues' });
Issue.hasMany(Note, { foreignKey: 'issueId', as: 'IssueNotes' });
User.hasMany(Note, { foreignKey: 'userId', as: 'UserNotes' });

Issue.belongsTo(User, { foreignKey: 'assignedTo', as: 'AssignedUser' });
Issue.belongsTo(User, { foreignKey: 'assignedBy', as: 'CreatorUser' });
Issue.belongsTo(Project, { foreignKey: 'projectId', as: 'Project' });
Note.belongsTo(Issue, { foreignKey: 'issueId', as: 'Issue' });
Note.belongsTo(User, { foreignKey: 'userId', as: 'Author' });

module.exports = { sequelize, User, Project, Issue, Note };
