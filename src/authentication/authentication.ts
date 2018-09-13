import { Request } from 'express';

import { Unauthorized } from '../types/api-error';
import jwtAuthorization from './jwt';
import { AuthType } from '../types/authentication';

export async function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<any> {
  switch (securityName) {
    case AuthType.JWT:
      return jwtAuthorization.check(request, scopes);
  }
  throw new Unauthorized();
}
