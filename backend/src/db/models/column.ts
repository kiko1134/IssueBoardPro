import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface ColumnAttributes {
    id: number;
    name: string;
    projectId: number;
    position: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ColumnCreationAttributes extends Optional<ColumnAttributes, 'id'> {}

export class Column
    extends Model<ColumnAttributes, ColumnCreationAttributes>
    implements ColumnAttributes {
    public id!: number;
    public name!: string;
    public projectId!: number;
    public position!: number;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    public static initialize(sequelize: Sequelize) {
        Column.init(
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
                projectId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                position: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    defaultValue: 0,
                },
            },
            {
                tableName: 'Columns',
                sequelize,
            }
        );
    }

    public static associate(models: any) {
        Column.belongsTo(models.Project, {
            foreignKey: 'projectId',
            as: 'project',
        });
        models.Project.hasMany(Column, {
            foreignKey: 'projectId',
            as: 'columns',
        });
    }
}
