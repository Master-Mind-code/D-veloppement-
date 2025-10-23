import { CommissionPaymentType } from '../../types';

export type CreateCommissionRateDTO = {
  type: CommissionPaymentType;
  rate: number;
  startDate: Date;
};

export type FilterCommissionRateDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};
