import {DataTypes, QueryInterface} from "sequelize";

export async function up(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.createTable('Users', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        username: {
            type: DataTypes.STRING(20),
            allowNull: false
        },
        email: {
            type: DataTypes.STRING(30),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },
        updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.dropTable('Users');
}