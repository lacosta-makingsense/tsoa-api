import * as superTest from 'supertest';
import { SuperTest } from 'supertest';

import { iocContainer } from '../config/ioc';
import { DbConnection } from '../config/db-connection';
import { Models } from '../models';
import { Server } from '../server/server';
import { ROOT_PATH } from './constants';

class IntegrationHelper {
  public app: SuperTest<any>;
  public rootPath = ROOT_PATH;

  private dbConnection: DbConnection;

  constructor() {
    this.dbConnection = iocContainer.get<DbConnection>(DbConnection);
  }

  public async setupDb() {
    await this.dbConnection.connect();
    iocContainer.get<Models>(Models);
    await this.dbConnection.sync();
  }

  public async createServer() {
    this.app = superTest(new Server().app);
  }
}

export default new IntegrationHelper();
