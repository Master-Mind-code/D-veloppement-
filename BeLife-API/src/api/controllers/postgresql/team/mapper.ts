import { Team } from '../../../../database/interfaces/postgresql';
import { TeamOutput } from '../../../../database/models/postgresql/team';

const TeamMapper = {
  toTeam: (team: TeamOutput): Team => {
    if (!team) return team as unknown as Team;

    return {
      id: team.id,
      teamName: team.teamName,
      supervisorName: team.supervisorName,
      createdAt: team.createdAt,
      updatedAt: team.updatedAt,
      deletedAt: team.deletedAt,
    };
  },
};

export default TeamMapper;
