import process from 'process';
import configJson from '../config/config.json';
import {User} from "./user";
import {Issue} from "./issue";
import {Status} from "./status";
import {Project} from "./project";
import {Sequelize} from "sequelize";
import {UserProjects} from "./userprojects";
import {Column} from "./column";
import {WorkLog} from "./worklog";

const env = process.env.NODE_ENV || 'development';
const config = (configJson as any)[env];

const sequelize = config.use_env_variable
    ? new Sequelize(process.env[config.use_env_variable]!, config)
    : new Sequelize(config.database, config.username, config.password, config);

User.initialize(sequelize);
Issue.initialize(sequelize);
Status.initialize(sequelize);
Project.initialize(sequelize);
UserProjects.initialize(sequelize);
Column.initialize(sequelize);
WorkLog.initialize(sequelize);

const db: any = {
    sequelize,
    Sequelize,
    User,
    Issue,
    Status,
    Project,
    UserProjects,
    Column,
    WorkLog
};

Object.values(db)
    .filter((m: any) => typeof m.associate === 'function')
    .forEach((m: any) => m.associate(db));

export default db;