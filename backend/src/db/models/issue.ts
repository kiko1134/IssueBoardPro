import {DataTypes, Model, Optional, Sequelize} from 'sequelize';

// Attributes interface for Issue
interface IssueAttributes {
    id: number;
    title: string;
    description?: string;
    statusId: number;
    projectId: number;
    columnId?: number;
    assignedTo?: number;
    assignedBy?: number;
    dueDate?: Date;
    priority: 'Low' | 'Medium' | 'High';
    type: 'Bug' | 'Feature' | 'Task';
    workLog?: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IssueCreationAttributes extends Optional<IssueAttributes, 'id' | 'columnId'> {
}

export class Issue
    extends Model<IssueAttributes, IssueCreationAttributes>
    implements IssueAttributes {
    // ! - (the definite assignment assertion) tells TypeScript:
    // “I know this field isn’t assigned in the constructor, but trust me—Sequelize will set it at runtime.”
    public id!: number;
    public title!: string;
    public description?: string;
    public statusId!: number;
    public projectId!: number;
    public assignedTo?: number;
    public assignedBy?: number;
    public dueDate?: Date;
    public priority!: 'Low' | 'Medium' | 'High';
    public type!: 'Bug' | 'Feature' | 'Task';
    public workLog?: number;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;


    static initialize(sequelizeInstance: Sequelize) {
        Issue.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                title: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                statusId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {model: 'Status', key: 'id'},
                },
                projectId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {model: 'Project', key: 'id'},
                },
                columnId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: true,
                    defaultValue: 0,
                },
                assignedTo: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: true,
                    references: {model: 'User', key: 'id'},
                },
                assignedBy: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: true,
                    references: {model: 'User', key: 'id'},
                },
                dueDate: {
                    type: DataTypes.DATE,
                    allowNull: true,
                },
                priority: {
                    type: DataTypes.ENUM('Low', 'Medium', 'High'),
                    allowNull: false,
                    defaultValue: 'Medium',
                },
                type: {
                    type: DataTypes.ENUM('Bug', 'Feature', 'Task'),
                    allowNull: false,
                },
                workLog: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: true,
                },
            },
            {
                tableName: 'Issues',
                sequelize: sequelizeInstance,
            }
        );
    }

    static associate(models: any) {
        Issue.belongsTo(models.Project, {foreignKey: 'projectId'});
        Issue.belongsTo(models.Status, {foreignKey: 'statusId'});
        Issue.belongsTo(models.User, {foreignKey: 'assignedTo', as: 'Assignee'});
        Issue.belongsTo(models.User, {foreignKey: 'assignedBy', as: 'Reporter'});
        Issue.hasMany(models.Note, {foreignKey: 'issueId'});
    }
}