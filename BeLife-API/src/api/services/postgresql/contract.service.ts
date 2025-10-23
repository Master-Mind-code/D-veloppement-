import ContractDal from '../../../database/dal/postgresql/contract.dal';
import { GetAllContractsFilters } from '../../../database/types';
import {
  ContractInput,
  ContractOutput,
  ContractPopulatedOutput,
} from '../../../database/models/postgresql/contract';

const ContractService = {
  create: (payload: ContractInput): Promise<ContractOutput> => {
    return ContractDal.create(payload);
  },
  update: (
    id: string,
    payload: Partial<ContractInput>,
  ): Promise<ContractOutput> => {
    return ContractDal.update(id, payload);
  },
  getById: (id: string): Promise<ContractPopulatedOutput> => {
    return ContractDal.getById(id);
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<ContractPopulatedOutput> => {
    const result = await ContractDal.getByParams(name, value);
    return result;
  },
  getAllByParams: async (
    name: string,
    value: string,
  ): Promise<ContractPopulatedOutput[]> => {
    const result = await ContractDal.getAllByParams(name, value);
    return result;
  },
  deleteById: (id: string): Promise<boolean> => {
    return ContractDal.deleteById(id);
  },
  getAll: (
    filters: GetAllContractsFilters,
  ): Promise<ContractPopulatedOutput[]> => {
    return ContractDal.getAll(filters);
  },
};

export default ContractService;
