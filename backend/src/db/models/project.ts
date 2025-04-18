import {DataTypes, Model, Optional, Sequelize} from 'sequelize';

interface ProjectAttributes {
    id: number;
    name: string;
    description?: string;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> {
}

export class Project
    extends Model<ProjectAttributes, ProjectCreationAttributes>
    implements ProjectAttributes {
    public id!: number;
    public name!: string;
    public description?: string;


    static initialize(sequelizeInstance: Sequelize) {
        Project.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(40),
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                tableName: 'Projects',
                sequelize: sequelizeInstance,
            }
        );
    }

    static associate(models: any) {
        Project.hasMany(models.Issue, {foreignKey: 'projectId'});
    }
}