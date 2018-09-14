import { Request } from 'express';

import { iocContainer, inject, injectable } from '../config/ioc';
import { AuthenticationService } from '../services/authentication';
import { Unauthorized, Forbidden } from '../types/api-error';

@injectable()
export class JWTAuthentication {
  constructor(@inject(AuthenticationService) private authenticationService: AuthenticationService) {
  }

  public async check(request: Request, scopes: string[] = []) {
    const header = request.headers.authorization || '';

    const matches = header.match(/^Bearer (.+)$/);

    if (matches === null) {
      throw new Unauthorized();
    }

    const token = matches[1];

    // Throws an `Unauthorized` error if decoding fails
    const decodedToken = this.authenticationService.decodeToken(token);

    const isAuthorized = scopes.every(scope => decodedToken.scopes.indexOf(scope) !== -1);

    if (! isAuthorized) {
      throw new Forbidden();
    }

    request.user = decodedToken;
  }
}

export default iocContainer.resolve(JWTAuthentication);
