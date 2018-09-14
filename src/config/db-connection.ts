import * as mongoose from 'mongoose';

import config from '../config';
import { Logger } from '../util/logger';
import { ProvideSingleton } from './ioc';

@ProvideSingleton(DbConnection)
export class DbConnection {
  constructor() {
    Logger.log(`connecting to ${config.environment} MongoDB`);
  }

  public async connect() {
    try {
      await mongoose.connect(config.mongo.url, config.mongo.connectionOptions);
    } catch (err) {
      this.connectionError(err);
    }

    mongoose.connection.on('error', (err) => {
      this.connectionError(err);
    });

    mongoose.connection.on('reconnect', function () {
      Logger.warn('Reconnecting to MongoDB');
    });

    mongoose.set('useCreateIndex', true);

    mongoose.set('debug', config.mongo.debug);
  }

  public async sync() {
    await mongoose.connection.dropDatabase();
  }

  private connectionError(err) {
    Logger.error('MongoDB connection error: ', err);
    process.exit(-1);
  }
}
