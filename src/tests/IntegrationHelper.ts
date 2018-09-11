import * as superTest from 'supertest';
import { SuperTest } from 'supertest';

import { iocContainer, inject, injectable } from '../config/ioc';
import { DbConnection } from '../config/db-connection';
import { Models } from '../models';
import { Server } from '../server/server';
import { ROOT_PATH } from './constants';

@injectable()
class IntegrationHelper {
  public app: SuperTest<any>;
  public rootPath = ROOT_PATH;

  constructor(@inject(DbConnection) private dbConnection: DbConnection,
              @inject(Models) private models: Models) {
  }

  public async setupDb() {
    await this.dbConnection.connect();
    this.models.setup();
    await this.dbConnection.sync();
  }

  public async createServer() {
    this.app = superTest(new Server().app);
  }

  // public async deleteAllUsers() {}
}

export default iocContainer.resolve(IntegrationHelper);
