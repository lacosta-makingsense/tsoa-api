import { UserAttributes } from './user';

type TokenUserKeys = (keyof UserAttributes)[];

export const TOKEN_USER_KEYS: TokenUserKeys = [ '_id', 'email', 'name' ];

export interface TokenPayload {
  _id: any;
  name: string;
  email: string;
  scopes: string[];
}

export interface LoginRequest {
  /**
   * @format email
   * @pattern ^[a-zA-Z0-9_.+-]+\x40[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$
   */
  email: string;
  /**
   * @minLength 1
   */
  password: string;
}

export interface AuthResponse {
  token: string;
}
