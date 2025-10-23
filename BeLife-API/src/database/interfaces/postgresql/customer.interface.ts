import { UUIDTypes } from 'uuid';

export interface Customer {
  id: UUIDTypes;
  fullName: string;
  birthDate: string;
  phoneNumber: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
