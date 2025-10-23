import { UUIDTypes } from 'uuid';
import { Optional } from 'sequelize';

export type CreateAgentDTO = {
  municipalityId: UUIDTypes;
  teamId: UUIDTypes;
  fullName: string;
  phoneNumber: string;
};

type UpdateAgent = {
  municipalityId: UUIDTypes;
  teamId: UUIDTypes;
  fullName: string;
};

export type UpdateAgentDTO = Optional<
  UpdateAgent,
  'fullName' | 'teamId' | 'municipalityId'
>;

export type FilterAgentDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};
