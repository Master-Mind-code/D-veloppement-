import PremiumFeeService from '../../../services/postgresql/premiumfee.service';
import {
  CreatePremiumFeeDTO,
  FilterPremiumFeeDTO,
} from '../../../../database/dto/postgresql/premiumfee.dto';
import {
  PremiumFee,
  PremiumFeePopulated,
} from '../../../../database/interfaces/postgresql';
import PremiumFeeMapper, { PremiumFeePopulatedMapper } from './mapper';

const PremiumFeeController = {
  create: async (paylad: CreatePremiumFeeDTO): Promise<PremiumFee> => {
    return PremiumFeeMapper.toPremiumFee(
      await PremiumFeeService.create(paylad),
    );
  },
  getById: async (id: string): Promise<PremiumFeePopulated> => {
    const result = await PremiumFeeService.getById(id);

    return PremiumFeePopulatedMapper.toPremiumFee(result);
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<PremiumFeePopulated> => {
    const result = await PremiumFeeService.getByParams(name, value);
    return PremiumFeePopulatedMapper.toPremiumFee(result);
  },
  getAllByParams: async (
    name: string,
    value: string,
  ): Promise<PremiumFeePopulated[]> => {
    const result = await PremiumFeeService.getAllByParams(name, value);
    return result.map(PremiumFeePopulatedMapper.toPremiumFee);
  },
  deleteById: async (id: string): Promise<boolean> => {
    const isDeleted = await PremiumFeeService.deleteById(id);
    return isDeleted;
  },
  getAll: async (
    filters: FilterPremiumFeeDTO,
  ): Promise<PremiumFeePopulated[]> => {
    return (await PremiumFeeService.getAll(filters)).map(
      PremiumFeePopulatedMapper.toPremiumFee,
    );
  },
};

export default PremiumFeeController;
