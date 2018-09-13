import { UserRole } from './authorization';

export interface UserRequest {
  /**
   * @format email
   * @pattern ^[a-zA-Z0-9_.+-]+\x40[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$
   */
  email: string;
  /**
   * @minLength 1
   */
  name: string;
  role: UserRole;
  /**
   * @minLength 1
   */
  password?: string;
}

export interface UserCreateRequest extends UserRequest {
  password: string;
}

export interface UserAttributes extends UserRequest {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
}

type UserRequestKeys = (keyof UserRequest)[];

export const USER_REQUEST_KEYS: UserRequestKeys = [ 'email', 'name', 'role', 'password' ];
