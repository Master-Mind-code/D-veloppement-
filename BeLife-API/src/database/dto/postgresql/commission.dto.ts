import { UUIDTypes } from 'uuid';
import { Optional } from 'sequelize';

import { CommissionPaymentType, CommissionStatus } from '../../types';

export type CreateCommissionDTO = {
  agentId: UUIDTypes;
  commissionRateId: UUIDTypes;
  amount: number;
  paymentType: CommissionPaymentType;
  paymentReference: string;
  status: CommissionStatus;
};

type UpdateCommission = {
  status: CommissionStatus;
};

export type UpdateCommissionDTO = Optional<UpdateCommission, 'status'>;

export type FilterCommissionDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};
