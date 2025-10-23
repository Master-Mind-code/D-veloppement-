import CommissionRateDal from '../../../database/dal/postgresql/commissionrate.dal';
import { GetAllCommissionRateFilters } from '../../../database/types';
import {
  CommissionRateInput,
  CommissionRateOuptut,
} from '../../../database/models/postgresql/comissionrate';

const CommissionRateService = {
  create: (payload: CommissionRateInput): Promise<CommissionRateOuptut> => {
    return CommissionRateDal.create(payload);
  },
  update: (
    id: string,
    payload: Partial<CommissionRateInput>,
  ): Promise<CommissionRateOuptut> => {
    return CommissionRateDal.update(id, payload);
  },
  getById: (id: string): Promise<CommissionRateOuptut> => {
    return CommissionRateDal.getById(id);
  },
  getByParams: (name: string, value: string): Promise<CommissionRateOuptut> => {
    return CommissionRateDal.getByParams(name, value);
  },
  deleteById: (id: string): Promise<boolean> => {
    return CommissionRateDal.deleteById(id);
  },
  getAll: (
    filters: GetAllCommissionRateFilters,
  ): Promise<CommissionRateOuptut[]> => {
    return CommissionRateDal.getAll(filters);
  },
};

export default CommissionRateService;
