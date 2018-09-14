import { iocContainer, inject, injectable } from '../config/ioc';

import { TYPES } from '../types/ioc';
import { UserModel, UserDocument } from '../models/user';
import { AuthenticationService } from '../services/authentication';
import { UserRole } from '../types/authorization';

@injectable()
class IntegrationOperations {

  constructor(@inject(TYPES.UserModel) private userModel: UserModel,
              @inject(AuthenticationService) private authenticationService: AuthenticationService) {
  }

  public async deleteAllUsers() {
    return this.userModel.deleteMany({});
  }

  public async createUser(index: number, role: UserRole, password: string, name = 'user') {
    return this.userModel.create({
      email: `${name}${index}@test.com`,
      name: `${name.toUpperCase()} ${index}`,
      role,
      password
    });
  }

  public getUserToken(user: UserDocument) {
    return this.authenticationService.createToken(user);
  }
}

export default iocContainer.resolve(IntegrationOperations);
