import {
  Premium,
  PremiumPopulated,
} from '../../../../database/interfaces/postgresql';
import {
  PremiumOutput,
  PremiumPopulatedOutput,
} from '../../../../database/models/postgresql/premium';

const PremiumMapper = {
  toPremium: (premium: PremiumOutput): Premium => {
    if (!premium) return premium as unknown as Premium;

    return {
      id: premium?.id,
      customerId: premium?.customerId,
      contractId: premium?.contractId,
      paymentAmount: premium?.paymentAmount,
      paymentStatus: premium?.paymentStatus,
      paymentMode: premium.paymentMode,
      paymentReference: premium?.paymentReference,
      createdAt: premium?.createdAt,
      updatedAt: premium?.updatedAt,
      deletedAt: premium?.deletedAt,
    };
  },
};

export const PremiumPopulatedMapper = {
  toPremium: (premium: PremiumPopulatedOutput): PremiumPopulated => {
    if (!premium) return premium as unknown as PremiumPopulated;

    return {
      id: premium?.id,
      customer: {
        id: premium['customer.id'],
        fullName: premium['customer.fullName'],
        birthDate: premium['customer.birthDate'],
        phoneNumber: premium['customer.phoneNumber'],
      },
      contract: {
        id: premium['contract.id'],
        insuranceId: premium['contract.insuranceId'],
        subscriptionId: premium['contract.subscriptionId'],
        contractStatus: premium['contract.contractStatus'],
        contractNumber: premium['contract.contractNumber'],
      },
      paymentAmount: premium?.paymentAmount,
      paymentStatus: premium?.paymentStatus,
      paymentMode: premium.paymentMode,
      paymentReference: premium?.paymentReference,
      createdAt: premium?.createdAt,
      updatedAt: premium?.updatedAt,
      deletedAt: premium?.deletedAt,
    };
  },
};

export default PremiumMapper;
