import InsuranceService from '../../../services/postgresql/insurance.service';
import {
  CreateInsuranceDTO,
  UpdateInsuranceDTO,
  FilterInsuranceDTO,
} from '../../../../database/dto/postgresql/insurance.dto';
import { Insurance } from '../../../../database/interfaces/postgresql';
import InsuranceMapper from './mapper';

const InsuranceController = {
  create: async (payload: CreateInsuranceDTO): Promise<Insurance> => {
    return InsuranceMapper.toInsurance(await InsuranceService.create(payload));
  },
  update: async (
    id: string,
    payload: UpdateInsuranceDTO,
  ): Promise<Insurance> => {
    return InsuranceMapper.toInsurance(
      await InsuranceService.update(id, payload),
    );
  },
  getById: async (id: string): Promise<Insurance> => {
    return InsuranceMapper.toInsurance(await InsuranceService.getById(id));
  },
  deleteById: async (id: string): Promise<boolean> => {
    const isDeleted = await InsuranceService.deleteById(id);

    return isDeleted;
  },
  getAll: async (filters: FilterInsuranceDTO): Promise<Insurance[]> => {
    return (await InsuranceService.getAll(filters)).map(
      InsuranceMapper.toInsurance,
    );
  },
};

export default InsuranceController;
