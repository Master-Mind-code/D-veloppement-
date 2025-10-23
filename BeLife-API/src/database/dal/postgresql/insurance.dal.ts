import { Op } from 'sequelize';
import Insurance from '../../models/postgresql/insurance';
import { GetAllInsurancesFilters } from '../../types';
import {
  InsuranceInput,
  InsuranceOutput,
} from '../../models/postgresql/insurance';

const InsuranceDal = {
  create: async (payload: InsuranceInput): Promise<InsuranceOutput> => {
    const insurance = await Insurance.create(payload);

    return insurance;
  },
  update: async (
    id: string,
    payload: Partial<InsuranceInput>,
  ): Promise<InsuranceOutput> => {
    const insurance = await Insurance.findByPk(id);

    if (!insurance) {
      // TODO throw custom error
      throw new Error('not found');
    }
    const updateInsurance = await (insurance as Insurance).update(payload);

    return updateInsurance;
  },
  getById: async (id: string): Promise<InsuranceOutput> => {
    const insurance = await Insurance.findByPk(id);

    if (!insurance) {
      // TODO throw custom error
      throw new Error('not found');
    }

    return insurance;
  },
  deleteById: async (id: string): Promise<boolean> => {
    const deleteInsuranceCount = await Insurance.destroy({ where: { id } });

    return !!deleteInsuranceCount;
  },
  getAll: async (
    filters?: GetAllInsurancesFilters,
  ): Promise<InsuranceOutput[]> => {
    return Insurance.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
    });
  },
};

export default InsuranceDal;
