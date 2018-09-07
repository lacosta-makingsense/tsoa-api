import {
  Route,
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Security,
  // Query,
  Path,
  Body,
  Response,
  Tags
} from 'tsoa';

import { ProvideSingleton, inject } from '../config/ioc';
import { UserAttributes, UserRequestData } from '../types/user';
// import { PaginationResponse } from '../types/pagination';
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

  /**
   * @param {number} page
   * @isInt page
   * @minimum page 1
   */
  // @Response(400, 'Bad request')
  // @Get()
  // public async getPaginated(
  //   @Query('page') page: number,
  //   @Query('limit') limit: number,
  //   @Query('fields') fields?: string,
  //   @Query('sort') sort?: string,
  //   @Query('q') q?: string): Promise<PaginationResponse> {
  //   return this.userService.getPaginated(page, limit, fields, sort, q);
  // }

  @Response(400, 'Bad request')
  @Security('admin')
  @Post()
  public async create(@Body() body: UserRequestData): Promise<UserAttributes> {
    return this.userService.create(body);
  }

  /**
   * @param {number} id
   * @isInt id
   */
  @Response(400, 'Bad request')
  @Security('admin')
  @Put('{id}')
  public async update(@Path() id: number, @Body() body: UserRequestData): Promise<UserAttributes> {
    return this.userService.update(id, body);
  }

  /**
   * @param {number} id
   * @isInt id
   */
  @Security('admin')
  @Delete('{id}')
  public async delete(@Path() id: number): Promise<void> {
    await this.userService.delete(id);
    return Promise.resolve();
  }
}
