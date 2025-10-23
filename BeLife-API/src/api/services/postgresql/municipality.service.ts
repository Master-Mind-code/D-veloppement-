import MunicipalityDal from '../../../database/dal/postgresql/municipality.dal';
import { GetAllMunicipalityFilters } from '../../../database/types';
import {
  MunicipalityInput,
  MunicipalityOutput,
} from '../../../database/models/postgresql/municipality';

const MunicipalityService = {
  create: (payload: MunicipalityInput): Promise<MunicipalityOutput> => {
    return MunicipalityDal.create(payload);
  },
  update: (
    id: string,
    payload: Partial<MunicipalityInput>,
  ): Promise<MunicipalityOutput> => {
    return MunicipalityDal.update(id, payload);
  },
  getById: (id: string): Promise<MunicipalityOutput> => {
    return MunicipalityDal.getById(id);
  },
  deleteById: (id: string): Promise<boolean> => {
    return MunicipalityDal.deleteById(id);
  },
  getAll: (
    filters: GetAllMunicipalityFilters,
  ): Promise<MunicipalityOutput[]> => {
    return MunicipalityDal.getAll(filters);
  },
};

export default MunicipalityService;
