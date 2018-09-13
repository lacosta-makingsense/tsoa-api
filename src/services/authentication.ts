import { sign, verify } from 'jsonwebtoken';

import { ProvideSingleton } from '../config/ioc';
import { UserDocument } from '../models/user';
import config from '../config';
import { TOKEN_USER_KEYS, TokenPayload } from '../types/authentication';
import { USER_SCOPES } from '../types/authorization';
import { Unauthorized } from '../types/api-error';
import { pick } from '../util/operators';

@ProvideSingleton(AuthenticationService)
export class AuthenticationService {

  public createToken(user: UserDocument): string {
    const payload = {
      ...pick(user, TOKEN_USER_KEYS),
      scopes: USER_SCOPES[user.role]
    } as TokenPayload;

    return sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiration,
      algorithm: config.jwt.algorithm
    });
  }

  public decodeToken(token): TokenPayload {
    try {
      return verify(token, config.jwt.secret, {
        algorithms: [ config.jwt.algorithm ]
      }) as TokenPayload;
    } catch (e) {
      throw new Unauthorized();
    }
  }
}
