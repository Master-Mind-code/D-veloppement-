import { UUIDTypes } from 'uuid';

import { UserRole } from '../../dto/postgresql/user.dto';

export interface User {
  id: UUIDTypes;
  fullName: string;
  email: string;
  role: UserRole;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
