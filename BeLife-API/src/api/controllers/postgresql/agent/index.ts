import AgentService from '../../../services/postgresql/agent.service';
import {
  CreateAgentDTO,
  UpdateAgentDTO,
  FilterAgentDTO,
} from '../../../../database/dto/postgresql/agent.dto';
import {
  Agent,
  AgentPopulated,
} from '../../../../database/interfaces/postgresql';
import AgentMapper, { AgentPopulatedMapper } from './mapper';

const AgentController = {
  create: async (payload: CreateAgentDTO): Promise<Agent> => {
    return AgentMapper.toAgent(await AgentService.create(payload));
  },
  update: async (id: string, payload: UpdateAgentDTO): Promise<Agent> => {
    return AgentMapper.toAgent(await AgentService.update(id, payload));
  },
  getById: async (id: string): Promise<AgentPopulated> => {
    const result = await AgentService.getById(id);
    return AgentPopulatedMapper.toAgent(result);
  },
  getByParams: async (name: string, value: string): Promise<AgentPopulated> => {
    const result = await AgentService.getByParams(name, value);

    return AgentPopulatedMapper.toAgent(result);
  },
  deleteById: async (id: string): Promise<boolean> => {
    const isDeleted = await AgentService.deleteById(id);

    return isDeleted;
  },
  getAll: async (filters: FilterAgentDTO): Promise<AgentPopulated[]> => {
    return (await AgentService.getAll(filters)).map(
      AgentPopulatedMapper.toAgent,
    );
  },
};

export default AgentController;
