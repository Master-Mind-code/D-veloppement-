import { UUIDTypes } from 'uuid';
import { ContractStatus } from '../../dto/postgresql/contract.dto';
import { Insurance } from './insurance.interface';
import { Customer } from './customer.interface';
import { SubscriptionPopulated } from './subscription.interface';

export interface Contract {
  id: UUIDTypes;
  customerId: UUIDTypes;
  insuranceId: UUIDTypes;
  subscriptionId: UUIDTypes;
  totalPayedPremiums: number;
  contractStatus: ContractStatus;
  contractNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface ContractPopulated {
  id: UUIDTypes;
  customer: Partial<Customer>;
  insurance: Partial<Insurance>;
  subscription: Partial<SubscriptionPopulated>;
  totalPayedPremiums: number;
  contractStatus: ContractStatus;
  contractNumber: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
