import { Model, DataTypes, Sequelize, Optional } from 'sequelize';

interface StatusAttributes {
    id: number;
    name: string;
}

interface StatusCreationAttributes extends Optional<StatusAttributes, 'id'> {}

export class Status
    extends Model<StatusAttributes, StatusCreationAttributes>
    implements StatusAttributes
{
    public id!: number;
    public name!: string;

    static initialize(sequelizeInstance: Sequelize) {
        Status.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                name: {
                    type: DataTypes.STRING(15),
                    allowNull: false,
                    unique: true,
                },
            },
            {
                tableName: 'Status',
                timestamps: false,
                sequelize: sequelizeInstance,
            }
        );
    }

    static associate(models: any) {
        Status.hasMany(models.Issue, { foreignKey: 'statusId' });
    }
}