import {
  PremiumFee,
  PremiumFeePopulated,
} from '../../../../database/interfaces/postgresql';
import {
  PremiumFeeOutput,
  PremiumFeePopulatedOutput,
} from '../../../../database/models/postgresql/premiumfee';

const PremiumFeeMapper = {
  toPremiumFee: (premiumfee: PremiumFeeOutput): PremiumFee => {
    if (!premiumfee) return premiumfee as unknown as PremiumFee;

    return {
      id: premiumfee?.id,
      insuranceId: premiumfee?.insuranceId,
      premiumFeeFormula: premiumfee?.premiumFeeFormula,
      premiumMonthlyFee: premiumfee?.premiumMonthlyFee,
      createdAt: premiumfee?.createdAt,
      updatedAt: premiumfee?.updatedAt,
      deletedAt: premiumfee?.deletedAt,
    };
  },
};

export const PremiumFeePopulatedMapper = {
  toPremiumFee: (
    premiumfee: PremiumFeePopulatedOutput,
  ): PremiumFeePopulated => {
    if (!premiumfee) return premiumfee as unknown as PremiumFeePopulated;

    return {
      id: premiumfee?.id,
      insurance: {
        id: premiumfee['insurance.id'],
        productName: premiumfee['insurance.productName'],
        membershipAmount: premiumfee['insurance.membershipAmount'],
      },
      premiumFeeFormula: premiumfee?.premiumFeeFormula,
      premiumMonthlyFee: premiumfee?.premiumMonthlyFee,
      createdAt: premiumfee?.createdAt,
      updatedAt: premiumfee?.updatedAt,
      deletedAt: premiumfee?.deletedAt,
    };
  },
};

export default PremiumFeeMapper;
