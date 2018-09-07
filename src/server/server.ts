import * as express from 'express';
import * as swaggerUi from 'swagger-ui-express';
import * as bodyParser from 'body-parser';
import * as morgan from 'morgan';

import config from '../config';
import errorHandler from '../middlewares/error-handler';
import cors from '../middlewares/cors';
import { RegisterRoutes } from '../routes/routes';
import { Logger } from '../util/logger';
import { iocContainer } from '../config/ioc';
import { DbConnection } from '../config/db-connection';
import { Models } from '../models';
import '../controllers';

export class Server {
  public app = express();
  private readonly port: number = config.port;

  constructor() {
    this.app.use(cors);
    this.app.use(bodyParser.json());
    this.app.use(morgan('dev', { skip: () => !Logger.shouldLog }));
    RegisterRoutes(this.app);
    this.app.use(errorHandler);

    if (config.environment !== 'production') {
      this.setupSwagger();
    }
  }

  public async listen(port: number = this.port) {
    process.on('uncaughtException', this.criticalErrorHandler);
    process.on('unhandledRejection', this.criticalErrorHandler);

    const dbConnection = iocContainer.get<DbConnection>(DbConnection);
    await dbConnection.connect();

    iocContainer.get<Models>(Models);

    const listen = this.app.listen(this.port);
    Logger.info(`${config.environment} server running on port: ${this.port}`);
    return listen;
  }

  private criticalErrorHandler(...args) {
    Logger.error('Critical Error...', ...args);
    process.exit(1);
  }

  private setupSwagger() {
    const swaggerDocument = require('../swagger/swagger.json');
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }
}
