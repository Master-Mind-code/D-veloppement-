import PremiumService from '../../../services/postgresql/premium.service';
import {
  CreatePremiumDTO,
  UpdatePremiumDTO,
  FilterPremiumsDTO,
} from '../../../../database/dto/postgresql/premium.dto';
import {
  Premium,
  PremiumPopulated,
} from '../../../../database/interfaces/postgresql';
import PremiumMapper, { PremiumPopulatedMapper } from './mapper';

const PremiumController = {
  create: async (payload: CreatePremiumDTO): Promise<Premium> => {
    return PremiumMapper.toPremium(await PremiumService.create(payload));
  },
  update: async (id: string, payload: UpdatePremiumDTO): Promise<Premium> => {
    return PremiumMapper.toPremium(await PremiumService.update(id, payload));
  },
  getById: async (id: string): Promise<PremiumPopulated> => {
    return PremiumPopulatedMapper.toPremium(await PremiumService.getById(id));
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<PremiumPopulated> => {
    return PremiumPopulatedMapper.toPremium(
      await PremiumService.getByParams(name, value),
    );
  },
  deleteById: async (id: string): Promise<boolean> => {
    const isDeleted = await PremiumService.deleteById(id);

    return isDeleted;
  },
  getAll: async (filters: FilterPremiumsDTO): Promise<PremiumPopulated[]> => {
    return (await PremiumService.getAll(filters)).map(
      PremiumPopulatedMapper.toPremium,
    );
  },
};

export default PremiumController;
