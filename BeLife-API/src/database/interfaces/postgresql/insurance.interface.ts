import { UUIDTypes } from 'uuid';

export interface Insurance {
  id: UUIDTypes;
  productName: string;
  type: string;
  description: string;
  membershipAmount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
