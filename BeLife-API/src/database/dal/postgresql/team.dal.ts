import { Op } from 'sequelize';
import Team from '../../models/postgresql/team';
import { GetAllTeamFilters } from '../../types';
import { TeamInput, TeamOutput } from '../../models/postgresql/team';
import Helper from '../../../../configs/helper';
import sequelizeLogger from '../../../../logs/sequelize';

const TeamDal = {
  create: async (payload: TeamInput): Promise<TeamOutput> => {
    const team = await Team.create(payload);

    return team;
  },
  update: async (
    id: string,
    payload: Partial<TeamInput>,
  ): Promise<TeamOutput> => {
    const team = await Team.findByPk(id);

    if (!Helper.hasNonNullValue(team, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - TeamDal.update()] No record matches the provided id ${id}`,
      );
    }

    const updateTeam = await (team as Team).update(payload);

    return updateTeam;
  },
  getById: async (id: string): Promise<TeamOutput> => {
    const team = await Team.findByPk(id);

    if (!Helper.hasNonNullValue(team, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - TeamDal.getById()] No record matches the provided id ${id}`,
      );
    }

    return team;
  },
  deleteById: async (id: string): Promise<boolean> => {
    // TODO Before deleting team we need to checkout if there is no agent bound to it.
    // Do not forgot to delete also commission owned by the agent if needed
    const deleteTeamCount = await Team.destroy({ where: { id } });

    return !!deleteTeamCount;
  },
  getAll: async (filters?: GetAllTeamFilters): Promise<TeamOutput[]> => {
    return Team.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
    });
  },
};

export default TeamDal;
