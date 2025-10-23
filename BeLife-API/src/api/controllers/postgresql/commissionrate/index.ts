import CommissionRateService from '../../../services/postgresql/commissionrate.service';
import {
  CreateCommissionRateDTO,
  FilterCommissionRateDTO,
} from '../../../../database/dto/postgresql/commissionrate.dto';
import { CommissionRate } from '../../../../database/interfaces/postgresql';
import CommissionRateMapper from './mapper';
import Helper from '../../../../../configs/helper';

const CommissionRateController = {
  create: async (payload: CreateCommissionRateDTO): Promise<CommissionRate> => {
    // Update current active commission rate
    const existingRate = await CommissionRateService.getByParams(
      'endDate',
      null,
    );

    if (Helper.hasNonNullValue(existingRate, 'id')) {
      await CommissionRateService.update(existingRate.id.toString(), {
        endDate: new Date(),
      });
    }

    // Create new commission rate
    return CommissionRateMapper.toCommissionRate(
      await CommissionRateService.create(payload),
    );
  },
  getById: async (id: string): Promise<CommissionRate> => {
    const result = await CommissionRateService.getById(id);
    return CommissionRateMapper.toCommissionRate(result);
  },
  getByParams: async (name: string, value: string): Promise<CommissionRate> => {
    const result = await CommissionRateService.getByParams(name, value);
    return CommissionRateMapper.toCommissionRate(result);
  },
  getAll: async (
    filters: FilterCommissionRateDTO,
  ): Promise<CommissionRate[]> => {
    return (await CommissionRateService.getAll(filters)).map(
      CommissionRateMapper.toCommissionRate,
    );
  },
};

export default CommissionRateController;
