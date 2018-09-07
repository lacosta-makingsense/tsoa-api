import { Request } from 'express';

import { Unauthorized } from '../types/api-error';

export type res = { status: number; message: string };

export async function expressAuthentication(request: Request, securityName: string, scopes?: string[]): Promise<res> {
  switch (securityName) {
    case 'admin':
      return null; /** everyone is an admin now :D */
  }
  throw new Unauthorized();
}