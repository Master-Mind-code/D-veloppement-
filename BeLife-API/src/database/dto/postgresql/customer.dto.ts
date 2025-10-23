import { Optional } from 'sequelize/types';

export type CreateCustomerDTO = {
  fullName: string;
  birthDate: string;
  phoneNumber: string;
  address: string | null;
};

export type UpdateCustomerDTO = Optional<
  CreateCustomerDTO,
  'fullName' | 'birthDate' | 'phoneNumber' | 'address'
>;

export type FilterCustomersDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};
