import { UUIDTypes } from 'uuid';

import { CommissionPaymentType } from '../../types';

export interface CommissionRate {
  id: UUIDTypes;
  type: CommissionPaymentType;
  rate: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
