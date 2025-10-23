import { UUIDTypes } from 'uuid';

import { PaymentMode, PaymentStatus } from '../../types';

import { Customer } from './customer.interface';
import { Beneficiary } from './beneficiary.interface';
import { Insurance } from './insurance.interface';
import { PremiumFee } from './premiumfee.interface';

export interface Subscription {
  id: UUIDTypes;
  customerId: UUIDTypes;
  beneficiaryId: UUIDTypes;
  insuranceId: UUIDTypes;
  premiumFeeId: UUIDTypes;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  paymentReference: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface SubscriptionPopulated {
  id: UUIDTypes;
  customer: Partial<Customer>;
  beneficiary: Partial<Beneficiary>;
  insurance: Partial<Insurance>;
  premiumFee: Partial<PremiumFee>;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  paymentReference: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
