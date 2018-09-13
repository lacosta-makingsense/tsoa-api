export enum UserRole {
  Admin = 'admin',
  User = 'user'
}

type UserScopes = {
  [K in UserRole]: string[];
};

export const USER_SCOPES: UserScopes = {
  admin: [],
  user: []
};

export const USER_ROLE_VALUES: string[] = Object.keys(UserRole).map(key => UserRole[key]);
