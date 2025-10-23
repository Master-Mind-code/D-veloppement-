import MunicipalityService from '../../../services/postgresql/municipality.service';
import {
  CreateMunicipalityDTO,
  UpdateMunicipalityDTO,
  FilterMunicipalityDTO,
} from '../../../../database/dto/postgresql/municipality.dto';
import { Municipality } from '../../../../database/interfaces/postgresql';
import MunicipalityMapper from './mapper';

const MunicipalityController = {
  create: async (payload: CreateMunicipalityDTO): Promise<Municipality> => {
    return MunicipalityMapper.toMunicipality(
      await MunicipalityService.create(payload),
    );
  },
  update: async (
    id: string,
    payload: UpdateMunicipalityDTO,
  ): Promise<Municipality> => {
    return MunicipalityMapper.toMunicipality(
      await MunicipalityService.update(id, payload),
    );
  },
  getById: async (id: string): Promise<Municipality> => {
    return MunicipalityMapper.toMunicipality(
      await MunicipalityService.getById(id),
    );
  },
  deleteById: async (id: string): Promise<boolean> => {
    const isDeleted = await MunicipalityService.deleteById(id);

    return isDeleted;
  },
  getAll: async (filters: FilterMunicipalityDTO): Promise<Municipality[]> => {
    return (await MunicipalityService.getAll(filters)).map(
      MunicipalityMapper.toMunicipality,
    );
  },
};

export default MunicipalityController;
