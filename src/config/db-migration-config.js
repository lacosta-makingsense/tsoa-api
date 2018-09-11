const path = require('path');
const config = require('dotenv').config;

const { env } = process;
config({ path: path.resolve(__dirname, `./env/.env.${env.NODE_ENV}`) });

const dbConfig = {
  [env.NODE_ENV]: {
    database: env.SQL_DB,
    username: env.SQL_USERNAME,
    password: env.SQL_PASSWORD,
    host: env.SQL_HOST,
    port: Number(env.SQL_PORT),
    dialect: env.SQL_DIALECT
  }
}

module.exports = dbConfig;
