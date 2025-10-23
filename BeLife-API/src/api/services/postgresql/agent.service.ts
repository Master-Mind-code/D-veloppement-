import AgentDal from '../../../database/dal/postgresql/agent.dal';
import { GetAllAgentFilters } from '../../../database/types';
import {
  AgentInput,
  AgentOutput,
  AgentPopulatedOuput,
} from '../../../database/models/postgresql/agent';

const AgentService = {
  create: (payload: AgentInput): Promise<AgentOutput> => {
    return AgentDal.create(payload);
  },
  update: (id: string, payload: Partial<AgentInput>): Promise<AgentOutput> => {
    return AgentDal.update(id, payload);
  },
  getById: (id: string): Promise<AgentPopulatedOuput> => {
    return AgentDal.getById(id);
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<AgentPopulatedOuput> => {
    return await AgentDal.getByParams(name, value);
  },
  deleteById: (id: string): Promise<boolean> => {
    return AgentDal.deleteById(id);
  },
  getAll: (filters: GetAllAgentFilters): Promise<AgentPopulatedOuput[]> => {
    return AgentDal.getAll(filters);
  },
};

export default AgentService;
