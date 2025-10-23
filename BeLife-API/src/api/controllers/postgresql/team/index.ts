import TeamService from '../../../services/postgresql/team.service';
import {
  CreateTeamDTO,
  UpdateTeamDTO,
  FilterTeamDTO,
} from '../../../../database/dto/postgresql/team.dto';
import { Team } from '../../../../database/interfaces/postgresql';
import TeamMapper from './mapper';

const TeamController = {
  create: async (payload: CreateTeamDTO): Promise<Team> => {
    return TeamMapper.toTeam(await TeamService.create(payload));
  },
  update: async (id: string, payload: UpdateTeamDTO): Promise<Team> => {
    return TeamMapper.toTeam(await TeamService.update(id, payload));
  },
  getById: async (id: string): Promise<Team> => {
    return TeamMapper.toTeam(await TeamService.getById(id));
  },
  deleteById: async (id: string): Promise<boolean> => {
    const isDeleted = await TeamService.deleteById(id);

    return isDeleted;
  },
  getAll: async (filters: FilterTeamDTO): Promise<Team[]> => {
    return (await TeamService.getAll(filters)).map(TeamMapper.toTeam);
  },
};

export default TeamController;
