import * as Sequelize from 'sequelize';

import config from '../config';
import { Logger } from '../util/logger';
import { ProvideSingleton } from './ioc';

@ProvideSingleton(DbConnection)
export class DbConnection {
  public db: Sequelize.Sequelize;

  constructor() {
    Logger.log(`connecting to ${config.environment} SQL`);
    const { SQL: dbConfig } = config;
    this.db = new Sequelize(dbConfig.db, dbConfig.username, dbConfig.password, {
      port: dbConfig.port,
      host: dbConfig.host,
      dialect: dbConfig.dialect,
      logging: (l) => Logger.verbose(l),
      // operatorsAliases: Sequelize.Op as any,
      define: { charset: 'utf8', collate: 'utf8_general_ci' }
    });
  }

  public async connect() {
    await this.db.authenticate();
  }

  public async sync() {
    await this.db.sync({ force: true });
  }
}
