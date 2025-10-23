import { Op } from 'sequelize';
import CommissionRate from '../../models/postgresql/comissionrate';
import { GetAllCommissionRateFilters } from '../../types';
import {
  CommissionRateInput,
  CommissionRateOuptut,
} from '../../models/postgresql/comissionrate';
import Helper from '../../../../configs/helper';
import sequelizeLogger from '../../../../logs/sequelize';

const CommissionRateDal = {
  create: async (
    payload: CommissionRateInput,
  ): Promise<CommissionRateOuptut> => {
    const commissionrate = await CommissionRate.create(payload);

    return commissionrate;
  },
  update: async (
    id: string,
    payload: Partial<CommissionRateInput>,
  ): Promise<CommissionRateOuptut> => {
    const commissionrate = await CommissionRate.findByPk(id);

    if (!Helper.hasNonNullValue(commissionrate, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - CommissionRateDal.update()] No record matches the provided id ${id}`,
      );
    }

    const updateCommissionrate = await (
      commissionrate as CommissionRate
    ).update(payload);

    return updateCommissionrate;
  },
  getById: async (id: string): Promise<CommissionRateOuptut> => {
    const commissionrate = await CommissionRate.findByPk(id);

    if (!Helper.hasNonNullValue(commissionrate, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - CommissionRateDal.getById()] No record matches the provided id ${id}`,
      );
    }

    return commissionrate;
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<CommissionRateOuptut> => {
    const commissionrate = await CommissionRate.findOne({
      where: { [name]: value },
    });

    if (!Helper.hasNonNullValue(commissionrate, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - CommissionRateDal.getByParams()] No record matches the provided ${name}: ${value}`,
      );
    }

    return commissionrate;
  },
  deleteById: async (id: string): Promise<boolean> => {
    // TODO Make sure that the old commission rate is not link to not paid commissions before deletion
    const deleteCommissionrateCount = await CommissionRate.destroy({
      where: { id },
    });

    return !!deleteCommissionrateCount;
  },
  getAll: async (
    filters?: GetAllCommissionRateFilters,
  ): Promise<CommissionRateOuptut[]> => {
    return CommissionRate.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
    });
  },
};

export default CommissionRateDal;
