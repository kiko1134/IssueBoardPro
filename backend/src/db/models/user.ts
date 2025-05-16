import {DataTypes, Model, Optional, Sequelize} from "sequelize";

interface UserAttributes {
    id: number;
    username: string;
    email: string;
    password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {
}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public id!: number;
    public username!: string;
    public email!: string;
    public password!: string;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static associate(models: any) {
        User.hasMany(models.Issue, {foreignKey: 'assignedTo', as: 'AssignedIssues'});
        User.hasMany(models.Issue, {foreignKey: 'assignedBy', as: 'ReportedIssues'});
        User.belongsToMany(models.Project, {
            through: models.UserProjects,
            foreignKey: 'userId',
            otherKey: 'projectId',
            as: 'AssignedProjects'
        });
    }

    public static initialize(sequelize: Sequelize) {
        User.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                username: {
                    type: DataTypes.STRING(20),
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING(30),
                    allowNull: false,
                    unique: true,
                },
                password: {
                    type: DataTypes.STRING,
                    allowNull: false,
                },
            },
            {
                tableName: 'Users',
                sequelize,
            }
        );
    }
}