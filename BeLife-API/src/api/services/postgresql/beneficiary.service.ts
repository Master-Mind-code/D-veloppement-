import BeneficiaryDal from '../../../database/dal/postgresql/beneficiary.dal';
import { GetAllCustomersFilters } from '../../../database/types';
import {
  BeneficiaryInput,
  BeneficiaryOutput,
} from '../../../database/models/postgresql/beneficiary';

const BeneficiaryService = {
  create: (payload: BeneficiaryInput): Promise<BeneficiaryOutput> => {
    return BeneficiaryDal.create(payload);
  },
  update: (
    id: string,
    payload: Partial<BeneficiaryInput>,
  ): Promise<BeneficiaryOutput> => {
    return BeneficiaryDal.update(id, payload);
  },
  getById: (id: string): Promise<BeneficiaryOutput> => {
    return BeneficiaryDal.getById(id);
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<BeneficiaryOutput> => {
    return await BeneficiaryDal.getByParams(name, value);
  },
  deleteById: (id: string): Promise<boolean> => {
    return BeneficiaryDal.deleteById(id);
  },
  getAll: (filters: GetAllCustomersFilters): Promise<BeneficiaryOutput[]> => {
    return BeneficiaryDal.getAll(filters);
  },
};

export default BeneficiaryService;
