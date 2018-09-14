import {
  Route,
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Security,
  Query,
  Path,
  Body,
  Response,
  Tags
} from 'tsoa';

import { ProvideSingleton, inject } from '../config/ioc';
import { UserAttributes, UserRequest, UserCreateRequest, USER_REQUEST_KEYS } from '../types/user';
import { PaginationResponse, SortDirection } from '../types/pagination';
import { UserService } from '../services/user';
import { pick } from '../util/operators';

@Tags('users')
@Route('users')
@ProvideSingleton(UserController)
export class UserController extends Controller {
  constructor(@inject(UserService) private userService: UserService) {
    super();
  }

  /**
   * @param {string} id
   * @pattern id ^[A-Fa-f\d]{24}$
   */
  @Response(400, 'Bad request')
  @Response(401, 'Unauthorized')
  @Response(403, 'Forbidden')
  @Response(404, 'Not Found')
  @Security('jwt', [ 'user:read' ])
  @Get('{id}')
  public async get(@Path() id: string): Promise<UserAttributes> {
    const user = await this.userService.getById(id);
    return user.toJSON();
  }

  /**
   * @param {number} page
   * @isInt page
   * @minimum page 1
   * @param {number} limit
   * @isInt limit
   * @minimum limit 1
   * @maximum limit 100
   * @param {string} query
   * @isString query
   * @param {string} sortBy
   * @isString sortBy
   * @param {string} sortDirection
   * @pattern sortDirection ^ASC|DESC$
   */
  @Response(400, 'Bad request')
  @Response(401, 'Unauthorized')
  @Response(403, 'Forbidden')
  @Security('jwt', [ 'user:read' ])
  @Get()
  public async search(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('query') query?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortDirection') sortDirection?: SortDirection): Promise<PaginationResponse<UserAttributes[]>> {
    return this.userService.search({ page, limit, sortBy, sortDirection, query });
  }

  @Response(400, 'Bad request')
  @Response(401, 'Unauthorized')
  @Response(403, 'Forbidden')
  @Security('jwt', [ 'user:write' ])
  @Post()
  public async create(@Body() body: UserCreateRequest): Promise<UserAttributes> {
    return this.userService.create(pick(body, USER_REQUEST_KEYS));
  }

  /**
   * @param {string} id
   * @pattern id ^[A-Fa-f\d]{24}$
   */
  @Response(400, 'Bad request')
  @Response(401, 'Unauthorized')
  @Response(403, 'Forbidden')
  @Response(404, 'Not Found')
  @Security('jwt', [ 'user:write' ])
  @Put('{id}')
  public async update(@Path() id: string, @Body() body: UserRequest): Promise<UserAttributes> {
    return this.userService.update(id, pick(body, USER_REQUEST_KEYS));
  }

  /**
   * @param {string} id
   * @pattern id ^[A-Fa-f\d]{24}$
   */
  @Response(400, 'Bad request')
  @Response(401, 'Unauthorized')
  @Response(403, 'Forbidden')
  @Response(404, 'Not Found')
  @Security('jwt', [ 'user:write' ])
  @Delete('{id}')
  public async delete(@Path() id: string): Promise<void> {
    await this.userService.delete(id);
    return Promise.resolve();
  }
}
