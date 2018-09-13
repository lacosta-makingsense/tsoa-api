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
import { LoginRequest, AuthResponse } from '../types/authentication';
import { AuthenticationService } from '../services/authentication';
import { UserService } from '../services/user';

@Tags('auth')
@Route('auth')
@ProvideSingleton(AuthController)
export class AuthController extends Controller {
  constructor(@inject(AuthenticationService) private authenticationService: AuthenticationService,
              @inject(UserService) private userService: UserService) {
    super();
  }

  // @Response(400, 'Bad request')
  // @Response(401, 'Unauthorized')
  // @Post()
  // public async login(@Body() body: LoginRequest): Promise<AuthResponse> {
  //   // return this.authenticationService.createToken();
  // }
}
