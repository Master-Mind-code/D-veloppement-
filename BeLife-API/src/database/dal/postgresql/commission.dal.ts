import { Op, Sequelize } from 'sequelize';
import Commission, {
  CommissionPopulatedOutput,
} from '../../models/postgresql/commission';
import { GetAllCommissionFilters } from '../../types';
import {
  CommissionInput,
  CommissionOutput,
} from '../../models/postgresql/commission';

import Helper from '../../../../configs/helper';
import sequelizeLogger from '../../../../logs/sequelize';
import Agent from '../../models/postgresql/agent';
import CommissionRate from '../../models/postgresql/comissionrate';

Commission.belongsTo(Agent, { foreignKey: 'agentId', as: 'agent' });
Commission.belongsTo(CommissionRate, {
  foreignKey: 'commissionRateId',
  as: 'commissionrate',
});

const CommissionDal = {
  create: async (payload: CommissionInput): Promise<CommissionOutput> => {
    const commission = await Commission.create(payload);

    return commission;
  },
  update: async (
    id: string,
    payload: Partial<CommissionInput>,
  ): Promise<CommissionOutput> => {
    const commission = await Commission.findByPk(id);

    if (!Helper.hasNonNullValue(commission, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - CommissionDal.update()] No record matches the provided id ${id}`,
      );
    }

    const updateCommission = await (commission as Commission).update(payload);

    return updateCommission;
  },
  getById: async (id: string): Promise<CommissionPopulatedOutput> => {
    const commission = await Commission.findByPk(id, {
      attributes: [
        'Commission.id',
        'Commission.amount',
        'Commission.paymentType',
        'Commission.paymentReference',
        'Commission.status',
        'Commission.createdAt',
        'Commission.updatedAt',
        'Commission.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Agent,
          as: 'agent',
          attributes: [
            'id',
            'municipalityId',
            'teamId',
            'fullName',
            'phoneNumber',
          ],
          required: true,
          on: {
            '$agent.id$': {
              [Op.eq]: Sequelize.col('Commission.agentId'),
            },
          },
        },
        {
          model: CommissionRate,
          as: 'commissionrate',
          attributes: ['id', 'type', 'rate'],
          required: true,
          on: {
            '$commissionrate.id$': {
              [Op.eq]: Sequelize.col('Commission.commissionRateId'),
            },
          },
        },
      ],
    });

    if (!Helper.hasNonNullValue(commission, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - CommissionDal.getById()] No record matches the provided id ${id}`,
      );
    }

    return commission as unknown as CommissionPopulatedOutput;
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<CommissionPopulatedOutput> => {
    const commission = await Commission.findOne({
      where: { [name]: value },
      attributes: [
        'Commission.id',
        'Commission.amount',
        'Commission.paymentType',
        'Commission.paymentReference',
        'Commission.status',
        'Commission.createdAt',
        'Commission.updatedAt',
        'Commission.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Agent,
          as: 'agent',
          attributes: [
            'id',
            'municipalityId',
            'teamId',
            'fullName',
            'phoneNumber',
          ],
          required: true,
          on: {
            '$agent.id$': {
              [Op.eq]: Sequelize.col('Commission.agentId'),
            },
          },
        },
        {
          model: CommissionRate,
          as: 'commissionrate',
          attributes: ['id', 'type', 'rate'],
          required: true,
          on: {
            '$commissionrate.id$': {
              [Op.eq]: Sequelize.col('Commission.commissionRateId'),
            },
          },
        },
      ],
    });

    if (!Helper.hasNonNullValue(commission, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - CommissionDal.getByParams()] No record matches the provided ${name}: ${value}`,
      );
    }

    return commission as unknown as CommissionPopulatedOutput;
  },
  getAllByParams: async (
    name: string,
    value: string,
  ): Promise<CommissionPopulatedOutput[]> => {
    const commission = await Commission.findAll({
      where: { [name]: value },
      attributes: [
        'Commission.id',
        'Commission.amount',
        'Commission.paymentType',
        'Commission.paymentReference',
        'Commission.status',
        'Commission.createdAt',
        'Commission.updatedAt',
        'Commission.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Agent,
          as: 'agent',
          attributes: [
            'id',
            'municipalityId',
            'teamId',
            'fullName',
            'phoneNumber',
          ],
          required: true,
          on: {
            '$agent.id$': {
              [Op.eq]: Sequelize.col('Commission.agentId'),
            },
          },
        },
        {
          model: CommissionRate,
          as: 'commissionrate',
          attributes: ['id', 'type', 'rate'],
          required: true,
          on: {
            '$commissionrate.id$': {
              [Op.eq]: Sequelize.col('Commission.commissionRateId'),
            },
          },
        },
      ],
    });

    if (!Helper.hasNonNullValue(commission, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - CommissionDal.getAllByParams()] No record matches the provided ${name}: ${value}`,
      );
    }

    return commission as unknown as CommissionPopulatedOutput[];
  },
  deleteById: async (id: string): Promise<boolean> => {
    const deleteCommission = await Commission.destroy({ where: { id } });

    return !!deleteCommission;
  },
  getAll: async (
    filters?: GetAllCommissionFilters,
  ): Promise<CommissionPopulatedOutput[]> => {
    return Commission.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
      attributes: [
        'Commission.id',
        'Commission.amount',
        'Commission.paymentType',
        'Commission.paymentReference',
        'Commission.status',
        'Commission.createdAt',
        'Commission.updatedAt',
        'Commission.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Agent,
          as: 'agent',
          attributes: [
            'id',
            'municipalityId',
            'teamId',
            'fullName',
            'phoneNumber',
          ],
          required: true,
          on: {
            '$agent.id$': {
              [Op.eq]: Sequelize.col('Commission.agentId'),
            },
          },
        },
        {
          model: CommissionRate,
          as: 'commissionrate',
          attributes: ['id', 'type', 'rate'],
          required: true,
          on: {
            '$commissionrate.id$': {
              [Op.eq]: Sequelize.col('Commission.commissionRateId'),
            },
          },
        },
      ],
    }) as unknown as CommissionPopulatedOutput[];
  },
};

export default CommissionDal;
