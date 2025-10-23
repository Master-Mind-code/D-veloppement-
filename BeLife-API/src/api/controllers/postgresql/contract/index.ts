import ContractService from '../../../services/postgresql/contract.service';
import {
  CreateContractDTO,
  UpdateContractDTO,
  FilterContractDTO,
} from '../../../../database/dto/postgresql/contract.dto';
import {
  Contract,
  ContractPopulated,
} from '../../../../database/interfaces/postgresql';
import ContractMapper, { ContractPopulateMapper } from './mapper';

const ContractController = {
  create: async (payload: CreateContractDTO): Promise<Contract> => {
    return ContractMapper.toContract(await ContractService.create(payload));
  },
  update: async (id: string, payload: UpdateContractDTO): Promise<Contract> => {
    return ContractMapper.toContract(await ContractService.update(id, payload));
  },
  getById: async (id: string): Promise<ContractPopulated> => {
    const result = await ContractService.getById(id);
    return ContractPopulateMapper.toContract(result);
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<ContractPopulated> => {
    const result = await ContractService.getByParams(name, value);
    return ContractPopulateMapper.toContract(result);
  },
  getAllByParams: async (
    name: string,
    value: string,
  ): Promise<ContractPopulated[]> => {
    const result = await ContractService.getAllByParams(name, value);

    return Promise.all(result.map(ContractPopulateMapper.toContract));
  },
  deleteById: async (id: string): Promise<boolean> => {
    const isDeleted = await ContractService.deleteById(id);

    return isDeleted;
  },
  getAll: async (filters: FilterContractDTO): Promise<ContractPopulated[]> => {
    return Promise.all((await ContractService.getAll(filters)).map(
      ContractPopulateMapper.toContract,
    ));
  },
};

export default ContractController;
