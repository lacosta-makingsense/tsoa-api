export interface UserRequestData {
  /**
   * @format email
   * @pattern ^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$
   */
  email: string;
  /**
   * @minLength 1
   */
  name: string;
}

export interface UserAttributes extends UserRequestData {
  id?: number;
}
