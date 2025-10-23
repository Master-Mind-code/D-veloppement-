/* eslint-disable @typescript-eslint/no-empty-object-type */
export interface CommonFilters {
  isDeleted?: boolean;
  includeDeleted?: boolean;
}

export enum PaymentStatus {
  Successful = 'REUSSI',
  Failed = 'ECHOUE',
  Pending = 'EN_ATTENTE',
}

export enum PaymentMode {
  Auto = 'PRELEVEMENT_AUTOMATIQUE',
  Manual = 'PAIEMENT_MANUEL',
}

export enum PremiumFeeFormula {
  Individual = 'INDIVIDUELLE',
  Family = 'FAMILLE',
}

export enum PremiumFeeLabel {
  BasicFamily = 'FAMILLE_BASIC',
  BasicIndividual = 'INDIVIDUELLE_BASIC',
  StandardIndividual = 'INDIVIDUELLE_STANDARD',
  StandardFamily = 'FAMILLE_STANDARD',
  PremiumIndividual = 'INDIVIDUELLE_PREMIUM',
  PremiumFamilly = 'FAMILLE_PREMIUM',
}

export enum CommissionPaymentType {
  Subscription = 'SOUSCRIPTION',
  MonthlyPremium = 'MONTHLY_PREMIUM',
}

export enum CommissionStatus {
  Init = 'INITIALISATION',
  Paid = 'PAYEE',
  UnPaid = 'NON_PAYEE',
}

export interface SubscriptionDetails {
  subscriptionDate: Date;
  premiumPlan: number; // Monthly premium amount
  totalPaidPremiums: number;
}

export interface GetAllCustomersFilters extends CommonFilters {}

export interface GetAllBeneficiariesFilters extends CommonFilters {}

export interface GetAllSubscriptionsFilters extends CommonFilters {}

export interface GetAllPaidAndAutoDebitSubscriptionsFilters
  extends CommonFilters {
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
}

export interface GetAllInsurancesFilters extends CommonFilters {}

export interface GetAllUsersFilters extends CommonFilters {}

export interface GetAllPremiumsFilters extends CommonFilters {}

export interface GetAllContractsFilters extends CommonFilters {}

export interface GetAllPremiumFeesFilters extends CommonFilters {}

export interface GetAllTeamFilters extends CommonFilters {}

export interface GetAllMunicipalityFilters extends CommonFilters {}

export interface GetAllCommissionRateFilters extends CommonFilters {}

export interface GetAllCommissionFilters extends CommonFilters {}

export interface GetAllAgentFilters extends CommonFilters {}
