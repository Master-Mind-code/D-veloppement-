import {
  Subscription,
  SubscriptionPopulated,
} from '../../../../database/interfaces/postgresql';
import {
  SubscriptionOutput,
  SubscriptionPopulatedOutput,
} from '../../../../database/models/postgresql/subscription';

const SubscriptionMapper = {
  toSubscription: (subscription: SubscriptionOutput): Subscription => {
    if (!subscription) return subscription as unknown as Subscription;

    return {
      id: subscription?.id,
      customerId: subscription?.customerId,
      beneficiaryId: subscription?.beneficiaryId,
      insuranceId: subscription?.insuranceId,
      premiumFeeId: subscription?.premiumFeeId,
      paymentMode: subscription?.paymentMode,
      paymentReference: subscription?.paymentReference,
      paymentStatus: subscription?.paymentStatus,
      createdAt: subscription?.createdAt,
      updatedAt: subscription?.updatedAt,
      deletedAt: subscription?.deletedAt,
    };
  },
};

export const SubscriptionPopulatedMapper = {
  toSubscription: (
    subscription: SubscriptionPopulatedOutput,
  ): SubscriptionPopulated => {
    if (!subscription) return subscription as unknown as SubscriptionPopulated;

    return {
      id: subscription?.id,
      customer: {
        fullName: subscription['customer.fullName'],
        birthDate: subscription['customer.birthDate'],
        phoneNumber: subscription['customer.phoneNumber'],
      },
      beneficiary: {
        fullName: subscription['beneficiary.fullName'],
        phoneNumber: subscription['beneficiary.phoneNumber'],
      },
      insurance: {
        productName: subscription['insurance.productName'],
        membershipAmount: subscription['insurance.membershipAmount'],
      },
      premiumFee: {
        id: subscription['premiumfee.id'],
        premiumFeeFormula: subscription['premiumfee.premiumFeeFormula'],
        premiumMonthlyFee: subscription['premiumfee.premiumMonthlyFee'],
      },
      paymentMode: subscription?.paymentMode,
      paymentReference: subscription?.paymentReference,
      paymentStatus: subscription?.paymentStatus,
      createdAt: subscription?.createdAt,
      updatedAt: subscription?.updatedAt,
      deletedAt: subscription?.deletedAt,
    };
  },
};

export default SubscriptionMapper;
