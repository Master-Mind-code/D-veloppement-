import { Dialect, Sequelize } from 'sequelize';

const dbName = process.env.PSQL_DB_NAME as string;
const dbUser = process.env.PSQL_USER as string;
const dbHost = process.env.PSQL_HOST;
const dbDriver = process.env.PSQL_DRIVER as Dialect;
const dbPassword = process.env.PSQL_USER_PASSWORD;
const dbPort = Number(process.env.PSQL_PORT);

const sequelizeConnection = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDriver,
  port: dbPort,
});

export default sequelizeConnection;
