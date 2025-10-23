import { UUIDTypes } from 'uuid';
import { PaymentMode, PaymentStatus } from '../../types';

import { Customer } from './customer.interface';
import { Contract } from './contract.interface';

export interface Premium {
  id: UUIDTypes;
  customerId: UUIDTypes;
  contractId: UUIDTypes;
  paymentAmount: number;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  paymentReference: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PremiumPopulated {
  id: UUIDTypes;
  customer: Partial<Customer>;
  contract: Partial<Contract>;
  paymentAmount: number;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  paymentReference: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
