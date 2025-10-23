import CommissionDal from '../../../database/dal/postgresql/commission.dal';
import { GetAllCommissionFilters } from '../../../database/types';
import {
  CommissionInput,
  CommissionOutput,
  CommissionPopulatedOutput,
} from '../../../database/models/postgresql/commission';

const CommissionService = {
  create: (payload: CommissionInput): Promise<CommissionOutput> => {
    return CommissionDal.create(payload);
  },
  update: (
    id: string,
    payload: Partial<CommissionInput>,
  ): Promise<CommissionOutput> => {
    return CommissionDal.update(id, payload);
  },
  getById: (id: string): Promise<CommissionPopulatedOutput> => {
    return CommissionDal.getById(id);
  },
  getByParams: (
    name: string,
    value: string,
  ): Promise<CommissionPopulatedOutput> => {
    return CommissionDal.getByParams(name, value);
  },
  getAllByParams: (
    name: string,
    value: string,
  ): Promise<CommissionPopulatedOutput[]> => {
    return CommissionDal.getAllByParams(name, value);
  },
  deleteById: (id: string): Promise<boolean> => {
    return CommissionDal.deleteById(id);
  },
  getAll: (
    filters: GetAllCommissionFilters,
  ): Promise<CommissionPopulatedOutput[]> => {
    return CommissionDal.getAll(filters);
  },
};

export default CommissionService;
