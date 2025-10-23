// import { Optional } from 'sequelize/types';
import { UUIDTypes } from 'uuid';
import { CreateCustomerDTO } from './customer.dto';
import { CreateBeneficiaryDTO } from './beneficiary.dto';
import { PaymentMode, PaymentStatus } from '../../types';
import { Optional } from 'sequelize';

export enum PremiumPlanIndividual {
  Basic = 3900,
  Standard = 5900,
  Elite = 10900,
}

export enum PremiumPlanFamily {
  Basic = 5700,
  Standard = 7700,
  Elite = 12700,
}

export type CreateSubscriptionDTO = {
  customerId: UUIDTypes;
  beneficiaryId: UUIDTypes;
  insuranceId: UUIDTypes;
  premiumFeeId: UUIDTypes;
  paymentMode: PaymentMode;
  paymentReference: string;
};

type UpdateSubscription = {
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
};

export type UpdateSubscriptionDTO = Optional<
  UpdateSubscription,
  'paymentStatus' | 'paymentMode'
>;

export type FilterSusbscriptionsDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};

export type FilterPaidAutoDebitSusbscriptionsDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
};

export type UssdPayloadForCreatingSubscription = {
  customer: CreateCustomerDTO;
  beneficiary: CreateBeneficiaryDTO;
  insuranceId: UUIDTypes;
  premiumFeeId: UUIDTypes;
  paymentMode: PaymentMode;
  paymentReference: string;
};

export type UssdPayloadForUpdatingSubscription = {
  paymentReference: string;
  paymentStatus?: PaymentStatus;
  paymentMode?: PaymentMode;
};
