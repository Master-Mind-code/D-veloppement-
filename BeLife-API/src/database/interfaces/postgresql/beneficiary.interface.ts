import { UUIDTypes } from 'uuid';

export interface Beneficiary {
  id: UUIDTypes;
  fullName: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
