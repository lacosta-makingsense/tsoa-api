import * as Sequelize from 'sequelize';

import { UserAttributes } from '../types/user';

export type UserInstance = Sequelize.Instance<UserAttributes> & UserAttributes;
export type UserModel = Sequelize.Model<UserInstance, UserAttributes>;

export const UserModelFactory = (sequelize: Sequelize.Sequelize, DataTypes: Sequelize.DataTypes): UserModel => {
    const model = sequelize.define<UserInstance, UserAttributes>('User', {
      name: DataTypes.STRING,
      email: DataTypes.STRING
    }, {});

    model.associate = function(models: Sequelize.Models) {
      // associations can be defined here
    };

    return model;
};
