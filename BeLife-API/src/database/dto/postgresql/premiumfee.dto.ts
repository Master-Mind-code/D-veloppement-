import { UUIDTypes } from 'uuid';
import { PremiumFeeFormula } from '../../types';

export type CreatePremiumFeeDTO = {
  insuranceId: UUIDTypes;
  premiumFeeFormula: PremiumFeeFormula;
  premiumMonthlyFee: number;
};

export type FilterPremiumFeeDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};
