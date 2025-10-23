import {
  Agent,
  AgentPopulated,
} from '../../../../database/interfaces/postgresql';
import {
  AgentOutput,
  AgentPopulatedOuput,
} from '../../../../database/models/postgresql/agent';

const AgentMapper = {
  toAgent: (agent: AgentOutput): Agent => {
    if (!agent) return agent as unknown as Agent;

    return {
      id: agent?.id,
      teamId: agent?.teamId,
      municipalityId: agent?.municipalityId,
      fullName: agent?.fullName,
      phoneNumber: agent?.phoneNumber,
      createdAt: agent?.createdAt,
      updatedAt: agent?.updatedAt,
      deletedAt: agent?.deletedAt,
    };
  },
};

export const AgentPopulatedMapper = {
  toAgent: (agent: AgentPopulatedOuput): AgentPopulated => {
    if (!agent) return agent as unknown as AgentPopulated;

    return {
      id: agent?.id,
      team: {
        id: agent['team.id'],
        teamName: agent['team.teamName'],
        supervisorName: agent['team.supervisorName'],
      },
      municipality: {
        id: agent['municipality.id'],
        name: agent['municipality.name'],
      },
      fullName: agent?.fullName,
      phoneNumber: agent?.phoneNumber,
      createdAt: agent?.createdAt,
      updatedAt: agent?.updatedAt,
      deletedAt: agent?.deletedAt,
    };
  },
};

export default AgentMapper;
