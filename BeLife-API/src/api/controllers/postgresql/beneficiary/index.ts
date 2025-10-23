import BeneficiaryService from '../../../services/postgresql/beneficiary.service';
import {
  CreateBeneficiaryDTO,
  UpdateBeneficiaryDTO,
  FilterBeneficairysDTO,
} from '../../../../database/dto/postgresql/beneficiary.dto';
import { Beneficiary } from '../../../../database/interfaces/postgresql';
import BeneficiaryMapper from './mapper';

const BeneficiaryController = {
  create: async (payload: CreateBeneficiaryDTO): Promise<Beneficiary> => {
    return BeneficiaryMapper.toBeneficiary(
      await BeneficiaryService.create(payload),
    );
  },
  update: async (
    id: string,
    payload: UpdateBeneficiaryDTO,
  ): Promise<Beneficiary> => {
    return BeneficiaryMapper.toBeneficiary(
      await BeneficiaryService.update(id, payload),
    );
  },
  getById: async (id: string): Promise<Beneficiary> => {
    return BeneficiaryMapper.toBeneficiary(
      await BeneficiaryService.getById(id),
    );
  },
  getByParams: async (name: string, value: string): Promise<Beneficiary> => {
    return BeneficiaryMapper.toBeneficiary(
      await BeneficiaryService.getByParams(name, value),
    );
  },
  deleteById: async (id: string): Promise<boolean> => {
    const isDeleted = await BeneficiaryService.deleteById(id);

    return isDeleted;
  },
  getAll: async (filters: FilterBeneficairysDTO): Promise<Beneficiary[]> => {
    return (await BeneficiaryService.getAll(filters)).map(
      BeneficiaryMapper.toBeneficiary,
    );
  },
};

export default BeneficiaryController;
