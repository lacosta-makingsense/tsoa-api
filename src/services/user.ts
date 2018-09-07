import { ProvideSingleton, inject } from '../config/ioc';
import { UserInstance, UserModel } from '../models/user';
import { NotFound } from '../types/api-error';
import { UserRequestData } from '../types/user';
import { TYPES } from '../types/ioc';

@ProvideSingleton(UserService)
export class UserService {

  constructor(@inject(TYPES.UserModel) protected userModel: UserModel) {
  }

  public async getById(id: number): Promise<UserInstance> {
    const user = await this.userModel.findById(id);

    if (! user) {
      throw new NotFound();
    }

    return user;
  }

  public async create(userData: UserRequestData): Promise<UserInstance> {
    return await this.userModel.create(userData);
  }

  public async update(id: number, userData: UserRequestData): Promise<UserInstance> {
    const user = await this.getById(id);

    return await user.update(userData);
  }

  public async delete(id: number): Promise<void> {
    const user = await this.getById(id);

    return await user.destroy();
  }
}
