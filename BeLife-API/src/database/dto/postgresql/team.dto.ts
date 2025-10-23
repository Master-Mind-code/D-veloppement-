import { Optional } from 'sequelize';

export type CreateTeamDTO = {
  teamName: string;
  supervisorName: string;
};

export type UpdateTeamDTO = Optional<
  CreateTeamDTO,
  'teamName' | 'supervisorName'
>;

export type FilterTeamDTO = {
  isDeleted?: boolean;
  includeDeleted?: boolean;
};
