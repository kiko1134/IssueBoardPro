import {Model, Sequelize} from 'sequelize';

export class UserProjects extends Model {
    static initialize(sequelize: Sequelize) {
        // This model is just for the join table; fields are inferred by migration
        UserProjects.init({}, { tableName: 'UserProjects', sequelize, timestamps: true });
    }
}