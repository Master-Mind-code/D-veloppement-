import { UUIDTypes } from 'uuid';

import { Agent } from './agent.interface';
import { CommissionRate } from './commissionrate.interface';
import { CommissionPaymentType, CommissionStatus } from '../../types';

export interface Commission {
  id: UUIDTypes;
  agentId: UUIDTypes;
  commissionRateId: UUIDTypes;
  amount: number;
  paymentType: CommissionPaymentType;
  paymentReference: string;
  status: CommissionStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface CommissionPopulated {
  id: UUIDTypes;
  agent: Partial<Agent>;
  commissionRate: Partial<CommissionRate>;
  amount: number;
  paymentType: CommissionPaymentType;
  paymentReference: string;
  status: CommissionStatus;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
