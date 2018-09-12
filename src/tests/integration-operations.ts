import { iocContainer, inject, injectable } from '../config/ioc';

import { TYPES } from '../types/ioc';
import { UserModel } from '../models/user';

@injectable()
class IntegrationOperations {

  constructor(@inject(TYPES.UserModel) protected userModel: UserModel) {
  }

  public async deleteAllUsers() {
    return this.userModel.deleteMany({});
  }

  public async createUser(index: number) {
    return this.userModel.create({
      email: `user${index}@test.com`,
      name: `User ${index}`
    });
  }

}

export default iocContainer.resolve(IntegrationOperations);
