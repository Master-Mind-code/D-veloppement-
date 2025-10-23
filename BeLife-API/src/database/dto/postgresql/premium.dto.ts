import { UUIDTypes } from 'uuid';
import { PaymentMode, PaymentStatus } from '../../types';

export type CreatePremiumDTO = {
  customerId: UUIDTypes;
  contractId: UUIDTypes;
  paymentAmount: number;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  paymentReference: string;
};

export type UpdatePremiumDTO = {
  paymentStatus: PaymentStatus;
};

export type FilterPremiumsDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};

export type UssdPayloadForCreatingPremium = {
  contractNumber: string;
  paymentReference: string;
};

export type UssdPaylodForUpdatingPremium = {
  paymentStatus: PaymentStatus;
  paymentReference: string;
};
