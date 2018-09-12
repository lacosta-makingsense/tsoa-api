import { ProvideSingleton, inject } from '../config/ioc';
import { UserModel, UserDocument } from '../models/user';
import { NotFound } from '../types/api-error';
import { UserRequestData } from '../types/user';
import { TYPES } from '../types/ioc';
import { PaginationParams, PaginationResponse, SORT_DIRECTION_MAP } from '../types/pagination';

@ProvideSingleton(UserService)
export class UserService {

  constructor(@inject(TYPES.UserModel) protected userModel: UserModel) {
  }

  public async getById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    if (! user) {
      throw new NotFound();
    }

    return user;
  }

  public async create(userData: UserRequestData): Promise<UserDocument> {
    return await this.userModel.create(userData);
  }

  public async update(id: string, userData: UserRequestData): Promise<UserDocument> {
    const options = { new: true, runValidators: true, context: 'query' };
    const user = await this.userModel.findOneAndUpdate({ _id: id }, userData, options);

    if (! user) {
      throw new NotFound();
    }

    return user;
  }

  public async delete(id: string): Promise<void> {
    const user = await (<any> this.userModel).findOneAndDelete({ _id: id });

    if (! user) {
      throw new NotFound();
    }

    return user;
  }

  public async search(params: PaginationParams): Promise<PaginationResponse<UserDocument[]>> {
    const { query, limit = 100, page = 1, sortBy, sortDirection = 'ASC' } = params;

    const queryParams: any = {};

    if (query) {
      queryParams.$or = [
        { email: { $regex: query, $options: 'i' } },
        { name: { $regex: query, $options: 'i' } }
      ];
    }

    const findQuery = this.userModel
      .find(queryParams)
      .skip((page - 1) * limit)
      .limit(limit);

    if (sortBy) {
      findQuery.sort({ [sortBy]: SORT_DIRECTION_MAP[sortDirection] });
    }

    const [ items, count ] = await Promise.all([
      findQuery,
      this.userModel.countDocuments(queryParams)
    ]);

    return { count, items };
  }
}
