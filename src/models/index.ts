import * as Sequelize from 'sequelize';

import { ProvideSingleton, inject, iocContainer } from '../config/ioc';

import { DbConnection } from '../config/db-connection';
import { UserModel, UserModelFactory } from './user';
import { TYPES } from '../types/ioc';

@ProvideSingleton(Models)
export class Models {

  private sequelize: Sequelize.Sequelize;

  constructor(@inject(DbConnection) protected dbConnection: DbConnection) {
    this.sequelize = this.dbConnection.db;

    this.loadModels();

    this.setupAssociations();
  }

  private loadModels() {
    const userModel: UserModel = UserModelFactory(this.sequelize, this.sequelize.Sequelize);
    iocContainer.bind<UserModel>(TYPES.UserModel).toConstantValue(userModel);
  }

  private setupAssociations() {
    const models = this.sequelize.models;
    Object.keys(models).forEach(model => {
      if (models[model].associate) {
        models[model].associate(models);
      }
    });
  }
}
