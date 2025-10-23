import { UUIDTypes } from 'uuid';

export interface Municipality {
  id: UUIDTypes;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
