import CommissionService from '../../../services/postgresql/commission.service';
import {
  CreateCommissionDTO,
  UpdateCommissionDTO,
  FilterCommissionDTO,
} from '../../../../database/dto/postgresql/commission.dto';
import {
  Commission,
  CommissionPopulated,
} from '../../../../database/interfaces/postgresql';
import CommissionMapper, { CommissionPopulatedMapper } from './mapper';

const CommissionController = {
  create: async (payload: CreateCommissionDTO): Promise<Commission> => {
    return CommissionMapper.toCommission(
      await CommissionService.create(payload),
    );
  },
  update: async (
    id: string,
    payload: UpdateCommissionDTO,
  ): Promise<Commission> => {
    return CommissionMapper.toCommission(
      await CommissionService.update(id, payload),
    );
  },
  getById: async (id: string): Promise<CommissionPopulated> => {
    const result = await CommissionService.getById(id);
    return CommissionPopulatedMapper.toCommission(result);
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<CommissionPopulated> => {
    const result = await CommissionService.getByParams(name, value);
    return CommissionPopulatedMapper.toCommission(result);
  },
  getAllByParams: async (
    name: string,
    value: string,
  ): Promise<CommissionPopulated[]> => {
    const result = await CommissionService.getAllByParams(name, value);
    return result.map(CommissionPopulatedMapper.toCommission);
  },
  getAll: async (
    filters: FilterCommissionDTO,
  ): Promise<CommissionPopulated[]> => {
    return (await CommissionService.getAll(filters)).map(
      CommissionPopulatedMapper.toCommission,
    );
  },
};

export default CommissionController;
