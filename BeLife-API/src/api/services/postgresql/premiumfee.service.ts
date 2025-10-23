import PremiumFeeDal from '../../../database/dal/postgresql/premiumfee.dal';
import { GetAllPremiumFeesFilters } from '../../../database/types';
import {
  PremiumFeeInput,
  PremiumFeeOutput,
  PremiumFeePopulatedOutput,
} from '../../../database/models/postgresql/premiumfee';

const PremiumFeeService = {
  create: (payload: PremiumFeeInput): Promise<PremiumFeeOutput> => {
    return PremiumFeeDal.create(payload);
  },
  getById: (id: string): Promise<PremiumFeePopulatedOutput> => {
    return PremiumFeeDal.getById(id);
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<PremiumFeePopulatedOutput> => {
    const result = await PremiumFeeDal.getByParams(name, value);

    return result;
  },
  getAllByParams: async (
    name: string,
    value: string,
  ): Promise<PremiumFeePopulatedOutput[]> => {
    const result = await PremiumFeeDal.getAllByParams(name, value);

    return result;
  },
  deleteById: (id: string): Promise<boolean> => {
    return PremiumFeeDal.deleteById(id);
  },
  getAll: (
    filters: GetAllPremiumFeesFilters,
  ): Promise<PremiumFeePopulatedOutput[]> => {
    return PremiumFeeDal.getAll(filters);
  },
};

export default PremiumFeeService;
