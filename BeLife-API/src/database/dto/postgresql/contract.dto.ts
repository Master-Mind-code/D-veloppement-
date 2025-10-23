import { Optional } from 'sequelize';
import { UUIDTypes } from 'uuid';

export enum ContractStatus {
  Active = 'ACTIF',
  Inactive = 'INACTIF',
  Terminated = 'RESILIER',
}

export type CreateContractDTO = {
  customerId: UUIDTypes;
  insuranceId: UUIDTypes;
  subscriptionId: UUIDTypes;
  contractNumber: string;
};

type UpdateContract = {
  totalPayedPremiums: number;
  contractStatus: ContractStatus;
};

export type UpdateContractDTO = Optional<
  UpdateContract,
  'totalPayedPremiums' | 'contractStatus'
>;

export type FilterContractDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};
