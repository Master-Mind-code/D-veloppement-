import { Optional } from 'sequelize/types';

export type CreateBeneficiaryDTO = {
  fullName: string;
  phoneNumber: string;
};

export type UpdateBeneficiaryDTO = Optional<
  CreateBeneficiaryDTO,
  'fullName' | 'phoneNumber'
>;

export type FilterBeneficairysDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};
