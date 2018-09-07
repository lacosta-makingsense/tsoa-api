import {
  Route,
  Controller,
  Get,
  // Put,
  Post,
  // Delete,
  Security,
  // Query,
  Path,
  Body,
  Response,
  Tags
} from 'tsoa';

import { ProvideSingleton, inject } from '../config/ioc';
import { UserAttributes, UserRequestData } from '../types/user';
import { UserService } from '../services/user';

@Tags('users')
@Route('users')
@ProvideSingleton(UserController)
export class UserController extends Controller {
  constructor(@inject(UserService) private userService: UserService) {
    super();
  }

  /**
   * @param {number} id
   * @isInt id
   */
  @Get('{id}')
  public async getById(@Path() id: number): Promise<UserAttributes> {
    const user = await this.userService.getById(id);
    return user.toJSON();
  }

  // @Get()
  // public async getPaginated(
  //   @Query('page') page: number,
  //   @Query('limit') limit: number,
  //   @Query('fields') fields?: string,
  //   @Query('sort') sort?: string,
  //   @Query('q') q?: string): Promise<IPaginationModel> {
  //   return this.userService.getPaginated(page, limit, fields, sort, q);
  // }

  @Response(400, 'Bad request')
  @Security('admin')
  @Post()
  public async create(@Body() body: UserRequestData): Promise<UserAttributes> {
    return this.userService.create(body);
  }

  // @Response(400, 'Bad request')
  // @Security('admin')
  // @Put('{id}')
  // public async update(id: string, @Body() body: IUserModel): Promise<IUserModel> {
  //   return this.userService.update(id, body);
  // }

  // @Security('admin')
  // @Delete('{id}')
  // public async delete(id: string): Promise<void> {
  //   return this.userService.delete(id);
  // }
}
