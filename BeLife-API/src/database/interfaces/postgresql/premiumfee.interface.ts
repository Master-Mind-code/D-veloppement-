import { UUIDTypes } from 'uuid';
import { PremiumFeeFormula } from '../../types';
import { Insurance } from './insurance.interface';

export interface PremiumFee {
  id: UUIDTypes;
  insuranceId: UUIDTypes;
  premiumFeeFormula: PremiumFeeFormula;
  premiumMonthlyFee: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface PremiumFeePopulated {
  id: UUIDTypes;
  insurance: Partial<Insurance>;
  premiumFeeFormula: PremiumFeeFormula;
  premiumMonthlyFee: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
