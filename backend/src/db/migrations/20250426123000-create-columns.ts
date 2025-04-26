import { QueryInterface, DataTypes, literal } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('Columns', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },

        name: {
            type: DataTypes.STRING(40),
            allowNull: false,
        },

        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Projects', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },

        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: literal('CURRENT_TIMESTAMP'),
        },
    });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('Columns');
}