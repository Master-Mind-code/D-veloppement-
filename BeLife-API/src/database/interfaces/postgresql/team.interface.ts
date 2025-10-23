import { UUIDTypes } from 'uuid';

export interface Team {
  id: UUIDTypes;
  teamName: string;
  supervisorName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
