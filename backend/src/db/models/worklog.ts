import { Model, DataTypes, Optional, Sequelize } from 'sequelize';

interface WorkLogAttrs {
    id: number;
    issueId: number;
    userId: number;
    minutes: number;
    createdAt?: Date;
    updatedAt?: Date;
}

interface WorkLogCreation extends Optional<WorkLogAttrs, 'id'> {}

export class WorkLog
    extends Model<WorkLogAttrs, WorkLogCreation>
    implements WorkLogAttrs
{
    public id!: number;
    public issueId!: number;
    public userId!: number;
    public minutes!: number;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;

    static initialize(sequelize: Sequelize) {
        WorkLog.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                issueId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                userId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                },
                minutes: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                },
            },
            {
                tableName: 'WorkLogs',
                sequelize,
            }
        );
    }

    static associate(models: any) {
        WorkLog.belongsTo(models.Issue, { foreignKey: 'issueId' });
        WorkLog.belongsTo(models.User, { foreignKey: 'userId' });
    }
}
