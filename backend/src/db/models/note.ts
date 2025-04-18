import {DataTypes, Model, Optional, Sequelize} from 'sequelize';

interface NoteAttributes {
    id: number;
    content: string;
    issueId: number;
    userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

// What is required at creation time
interface NoteCreationAttributes extends Optional<NoteAttributes, 'id'> {
}

export class Note
    extends Model<NoteAttributes, NoteCreationAttributes>
    implements NoteAttributes {
    public id!: number;
    public content!: string;
    public issueId!: number;
    public userId!: number;


    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;


    static initialize(sequelizeInstance: Sequelize) {
        Note.init(
            {
                id: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    autoIncrement: true,
                    primaryKey: true,
                },
                content: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                issueId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {model: 'Issue', key: 'id'},
                },
                userId: {
                    type: DataTypes.INTEGER.UNSIGNED,
                    allowNull: false,
                    references: {model: 'User', key: 'id'},
                },
            },
            {
                tableName: 'Notes',
                sequelize: sequelizeInstance,
            }
        );
    }


    static associate(models: any) {
        Note.belongsTo(models.Issue, {foreignKey: 'issueId'});
        Note.belongsTo(models.User, {foreignKey: 'userId'});
    }
}