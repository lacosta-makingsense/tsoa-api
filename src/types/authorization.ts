export enum UserRole {
  Admin = 'admin',
  User = 'user'
}

export enum Scope {
  UserWrite = 'user:write',
  UserRead = 'user:read'
}

type AuthorizationScopes = {
  [K in UserRole]: Scope[];
};

export const AUTHORIZATION_SCOPES: AuthorizationScopes = {
  [UserRole.Admin]: [ Scope.UserRead, Scope.UserWrite ],
  [UserRole.User]: [ Scope.UserRead ]
};

export const USER_ROLE_VALUES: string[] = Object.keys(UserRole).map(key => UserRole[key]);
