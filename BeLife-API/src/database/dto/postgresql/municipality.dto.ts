import { Optional } from 'sequelize';

export type CreateMunicipalityDTO = {
  name: string;
};

export type UpdateMunicipalityDTO = Optional<CreateMunicipalityDTO, 'name'>;

export type FilterMunicipalityDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};
