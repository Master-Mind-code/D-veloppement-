import { Optional } from 'sequelize/types';

export type CreateInsuranceDTO = {
  productName: string;
  type: string;
  description: string;
  membershipAmount: number;
};

export type UpdateInsuranceDTO = Optional<
  CreateInsuranceDTO,
  'productName' | 'type' | 'description' | 'membershipAmount'
>;

export type FilterInsuranceDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};
