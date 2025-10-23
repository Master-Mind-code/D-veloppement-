import { Op, Sequelize } from 'sequelize';
import PremiumFee, {
  PremiumFeePopulatedOutput,
} from '../../models/postgresql/premiumfee';
import { GetAllPremiumFeesFilters } from '../../types';
import {
  PremiumFeeInput,
  PremiumFeeOutput,
} from '../../models/postgresql/premiumfee';
import Insurance from '../../models/postgresql/insurance';

import sequelizeLogger from '../../../../logs/sequelize';

PremiumFee.belongsTo(Insurance, {
  foreignKey: 'insuranceId',
  as: 'insurance',
});

const PremiumFeeDal = {
  create: async (payload: PremiumFeeInput): Promise<PremiumFeeOutput> => {
    const premiumfee = await PremiumFee.create(payload);

    return premiumfee;
  },
  getById: async (id: string): Promise<PremiumFeePopulatedOutput> => {
    const premiumfee = await PremiumFee.findByPk(id, {
      attributes: [
        'Premiumfee.id',
        'Premiumfee.premiumFeeFormula',
        'Premiumfee.premiumMonthlyFee',
        'Premiumfee.createdAt',
        'Premiumfee.updatedAt',
        'Premiumfee.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['id', 'productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Premiumfee.insuranceId'),
            },
          },
        },
      ],
    });

    if (!premiumfee) {
      sequelizeLogger.error(
        '[Sequelize - PremiumFeeDal.getById()] Unable to find the premium fee',
      );
    }

    return premiumfee as unknown as PremiumFeePopulatedOutput;
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<PremiumFeePopulatedOutput> => {
    const premiumfee = await PremiumFee.findOne({
      where: { [name]: value },
      attributes: [
        'Premiumfee.id',
        'Premiumfee.premiumFeeFormula',
        'Premiumfee.premiumMonthlyFee',
        'Premiumfee.createdAt',
        'Premiumfee.updatedAt',
        'Premiumfee.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['id', 'productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Premiumfee.insuranceId'),
            },
          },
        },
      ],
    });

    if (!premiumfee) {
      sequelizeLogger.error(
        '[Sequelize - PremiumFeeDal.getByParams()] Unable to find the premium fee',
      );
    }

    return premiumfee as unknown as PremiumFeePopulatedOutput;
  },
  getAllByParams: async (
    name: string,
    value: string,
  ): Promise<PremiumFeePopulatedOutput[]> => {
    const premiumfee = await PremiumFee.findAll({
      where: { [name]: value },
      attributes: [
        'Premiumfee.id',
        'Premiumfee.premiumFeeFormula',
        'Premiumfee.premiumMonthlyFee',
        'Premiumfee.createdAt',
        'Premiumfee.updatedAt',
        'Premiumfee.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['id', 'productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Premiumfee.insuranceId'),
            },
          },
        },
      ],
    });

    if (!premiumfee) {
      sequelizeLogger.error(
        '[Sequelize - PremiumFeeDal.getAllByParams()] Unable to find the premium fee',
      );
    }

    return premiumfee as unknown as PremiumFeePopulatedOutput[];
  },
  deleteById: async (id: string): Promise<boolean> => {
    const deletePremiumFeeCount = await PremiumFee.destroy({
      where: { id },
    });

    return !!deletePremiumFeeCount;
  },
  getAll: async (
    filters?: GetAllPremiumFeesFilters,
  ): Promise<PremiumFeePopulatedOutput[]> => {
    return PremiumFee.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
      attributes: [
        'Premiumfee.id',
        'Premiumfee.premiumFeeFormula',
        'Premiumfee.premiumMonthlyFee',
        'Premiumfee.createdAt',
        'Premiumfee.updatedAt',
        'Premiumfee.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['id', 'productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Premiumfee.insuranceId'),
            },
          },
        },
      ],
    }) as unknown as PremiumFeePopulatedOutput[];
  },
};

export default PremiumFeeDal;
