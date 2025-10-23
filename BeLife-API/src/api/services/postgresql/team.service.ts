import TeamDal from '../../../database/dal/postgresql/team.dal';
import { GetAllTeamFilters } from '../../../database/types';
import {
  TeamInput,
  TeamOutput,
} from '../../../database/models/postgresql/team';

const TeamService = {
  create: (payload: TeamInput): Promise<TeamOutput> => {
    return TeamDal.create(payload);
  },
  update: (id: string, payload: Partial<TeamInput>): Promise<TeamOutput> => {
    return TeamDal.update(id, payload);
  },
  getById: (id: string): Promise<TeamOutput> => {
    return TeamDal.getById(id);
  },
  deleteById: (id: string): Promise<boolean> => {
    return TeamDal.deleteById(id);
  },
  getAll: (filters: GetAllTeamFilters): Promise<TeamOutput[]> => {
    return TeamDal.getAll(filters);
  },
};

export default TeamService;
