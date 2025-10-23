import PremiumDal from '../../../database/dal/postgresql/premium.dal';
import { GetAllPremiumsFilters } from '../../../database/types';
import {
  PremiumInput,
  PremiumOutput,
  PremiumPopulatedOutput,
} from '../../../database/models/postgresql/premium';

const PremiumService = {
  create: (payload: PremiumInput): Promise<PremiumOutput> => {
    return PremiumDal.create(payload);
  },
  update: (
    id: string,
    payload: Partial<PremiumInput>,
  ): Promise<PremiumOutput> => {
    return PremiumDal.update(id, payload);
  },
  getById: (id: string): Promise<PremiumPopulatedOutput> => {
    return PremiumDal.getById(id);
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<PremiumPopulatedOutput> => {
    const result = await PremiumDal.getByParams(name, value);

    return result;
  },
  deleteById: (id: string): Promise<boolean> => {
    return PremiumDal.deleteById(id);
  },
  getAll: (
    filters: GetAllPremiumsFilters,
  ): Promise<PremiumPopulatedOutput[]> => {
    return PremiumDal.getAll(filters);
  },
};

export default PremiumService;
