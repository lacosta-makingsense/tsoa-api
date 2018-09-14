import { ProvideSingleton, inject } from '../config/ioc';
import { UserModel, UserDocument } from '../models/user';
import { NotFound, Unauthorized } from '../types/api-error';
import { UserRequest } from '../types/user';
import { LoginRequest } from '../types/authentication';
import { TYPES } from '../types/ioc';
import { PaginationParams, PaginationResponse, SORT_DIRECTION_MAP } from '../types/pagination';

@ProvideSingleton(UserService)
export class UserService {

  constructor(@inject(TYPES.UserModel) private userModel: UserModel) {
  }

  public async getById(id: string): Promise<UserDocument> {
    const user = await this.userModel.findById(id);

    if (! user) {
      throw new NotFound();
    }

    return user;
  }

  public async create(userData: UserRequest): Promise<UserDocument> {
    return this.userModel.create(userData);
  }

  public async update(id: string, userData: UserRequest): Promise<UserDocument> {
    const user = await this.getById(id);

    user.set(userData);

    await user.save();

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

  public async authenticate(login: LoginRequest) {
    const user = await this.userModel.findOne({ email: login.email })
      .select('+hashedPassword');

    if (! user) {
      throw new Unauthorized();
    }

    const result = await user.checkPassword(login.password);

    if (! result) {
      throw new Unauthorized();
    }

    return user;
  }
}
