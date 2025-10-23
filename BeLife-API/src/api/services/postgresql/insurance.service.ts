import InsuranceDal from '../../../database/dal/postgresql/insurance.dal';
import { GetAllInsurancesFilters } from '../../../database/types';
import {
  InsuranceInput,
  InsuranceOutput,
} from '../../../database/models/postgresql/insurance';

const InsuranceService = {
  create: (payload: InsuranceInput): Promise<InsuranceOutput> => {
    return InsuranceDal.create(payload);
  },
  update: (
    id: string,
    payload: Partial<InsuranceInput>,
  ): Promise<InsuranceOutput> => {
    return InsuranceDal.update(id, payload);
  },
  getById: (id: string): Promise<InsuranceOutput> => {
    return InsuranceDal.getById(id);
  },
  deleteById: (id: string): Promise<boolean> => {
    return InsuranceDal.deleteById(id);
  },
  getAll: (filters: GetAllInsurancesFilters): Promise<InsuranceOutput[]> => {
    return InsuranceDal.getAll(filters);
  },
};

export default InsuranceService;
