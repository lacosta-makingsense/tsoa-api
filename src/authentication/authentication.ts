import { Request } from 'express';

import { Unauthorized } from '../types/api-error';
import jwtAuthentication from './jwt';
import { AuthType } from '../types/authentication';

export async function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<any> {
  switch (securityName) {
    case AuthType.JWT:
      return jwtAuthentication.check(request, scopes);
  }
  throw new Unauthorized();
}
