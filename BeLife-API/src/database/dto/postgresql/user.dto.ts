import { Optional } from 'sequelize/types';

export enum UserRole {
  Admin = 'ADMINISTRATOR',
  Developer = 'DEVELOPER',
  Staff = 'PRUBELIFE_STAFF',
}

export type CreateUserDTO = {
  fullName: string;
  email: string;
  role: UserRole;
  password: string;
};

export type UpdateUserDTO = Optional<
  CreateUserDTO,
  'fullName' | 'email' | 'password' | 'role'
>;

export type FilterUserDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};
