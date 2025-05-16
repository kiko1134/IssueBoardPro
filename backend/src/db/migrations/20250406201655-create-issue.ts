import { QueryInterface, DataTypes, literal } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('Issues', {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        statusId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Status', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
        },
        projectId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: { model: 'Projects', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'CASCADE',
        },
        assignedTo: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: { model: 'Users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
        },
        assignedBy: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: true,
            references: { model: 'Users', key: 'id' },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
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
        columnId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
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
    await queryInterface.dropTable('Issues');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Issues_priority";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_Issues_type";');
}