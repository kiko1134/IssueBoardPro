const sequelize = require('../config/database');

const Issue = require('./issue');
const Note = require('./note');
const Project = require('./project');
const Status = require('./status');
const User = require('./user');

// === Associations ===

// Issue belongs to Project, Status, User (assignedTo, assignedBy)
Issue.belongsTo(Project, { foreignKey: 'projectId' });
Project.hasMany(Issue, { foreignKey: 'projectId' });

Issue.belongsTo(Status, { foreignKey: 'statusId' });
Status.hasMany(Issue, { foreignKey: 'statusId' });

Issue.belongsTo(User, { as: 'Assignee', foreignKey: 'assignedTo' });
Issue.belongsTo(User, { as: 'Assigner', foreignKey: 'assignedBy' });
User.hasMany(Issue, { as: 'AssignedIssues', foreignKey: 'assignedTo' });
User.hasMany(Issue, { as: 'GivenIssues', foreignKey: 'assignedBy' });

// Note belongs to Issue and User
Note.belongsTo(Issue, { foreignKey: 'issueId' });
Issue.hasMany(Note, { foreignKey: 'issueId' });

Note.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Note, { foreignKey: 'userId' });

// === Export models ===

module.exports = {
    sequelize,
    Issue,
    Note,
    Project,
    Status,
    User
};