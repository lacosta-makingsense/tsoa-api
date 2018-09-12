export interface UserRequestData {
  /**
   * @format email
   * @pattern ^[a-zA-Z0-9_.+-]+\x40[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$
   */
  email: string;
  /**
   * @minLength 1
   */
  name: string;
}

type UserRequestKeys = (keyof UserRequestData)[];

export const USER_REQUEST_KEYS: UserRequestKeys = [ 'email', 'name' ];

export interface UserAttributes extends UserRequestData {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
}
