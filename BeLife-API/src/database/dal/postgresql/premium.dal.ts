import { Op, Sequelize } from 'sequelize';
import Premium from '../../models/postgresql/premium';
import { GetAllPremiumsFilters } from '../../types';
import {
  PremiumInput,
  PremiumOutput,
  PremiumPopulatedOutput,
} from '../../models/postgresql/premium';
import Customer from '../../models/postgresql/customer';
import Contract from '../../models/postgresql/contract';
import sequelizeLogger from '../../../../logs/sequelize';

Premium.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Premium.belongsTo(Contract, {
  foreignKey: 'contractId',
  as: 'contract',
});

const PremiumDal = {
  create: async (payload: PremiumInput): Promise<PremiumOutput> => {
    const premium = await Premium.create(payload);

    return premium;
  },
  update: async (
    id: string,
    payload: Partial<PremiumInput>,
  ): Promise<PremiumOutput> => {
    const premium = await Premium.findByPk(id);

    if (!premium) {
      // TODO throw custom error
      throw new Error('not found');
    }

    const updatePremium = await (premium as Premium).update(payload);

    return updatePremium;
  },
  getById: async (id: string): Promise<PremiumPopulatedOutput> => {
    const premium = await Premium.findByPk(id, {
      attributes: [
        'Premium.id',
        'Premium.paymentAmount',
        'Premium.paymentStatus',
        'Premium.paymentMode',
        'Premium.paymentReference',
        'Premium.createdAt',
        'Premium.updatedAt',
        'Premium.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'fullName', 'birthDate', 'phoneNumber'],
          required: true,
          on: {
            '$customer.id$': {
              [Op.eq]: Sequelize.col('Premium.customerId'),
            },
          },
        },
        {
          model: Contract,
          as: 'contract',
          attributes: [
            'id',
            'insuranceId',
            'subscriptionId',
            'contractStatus',
            'contractNumber',
          ],
          required: true,
          on: {
            '$contract.id$': {
              [Op.eq]: Sequelize.col('Premium.contractId'),
            },
          },
        },
      ],
    });

    if (!premium) {
      // TODO throw custom error
      throw new Error('not found');
    }

    return premium as unknown as PremiumPopulatedOutput;
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<PremiumPopulatedOutput> => {
    const premium = await Premium.findOne({
      where: { [name]: value },
      attributes: [
        'Premium.id',
        'Premium.paymentAmount',
        'Premium.paymentStatus',
        'Premium.paymentMode',
        'Premium.paymentReference',
        'Premium.createdAt',
        'Premium.updatedAt',
        'Premium.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'fullName', 'birthDate', 'phoneNumber'],
          required: true,
          on: {
            '$customer.id$': {
              [Op.eq]: Sequelize.col('Premium.customerId'),
            },
          },
        },
        {
          model: Contract,
          as: 'contract',
          attributes: [
            'id',
            'insuranceId',
            'subscriptionId',
            'contractStatus',
            'contractNumber',
          ],
          required: true,
          on: {
            '$contract.id$': {
              [Op.eq]: Sequelize.col('Premium.contractId'),
            },
          },
        },
      ],
    });

    if (!premium) {
      sequelizeLogger.error(
        '[Sequelize - PremiumDal.getByParams()] Unable to find premium: ',
      );
    }
    return premium as unknown as PremiumPopulatedOutput;
  },
  deleteById: async (id: string): Promise<boolean> => {
    const deletePremiumCount = await Premium.destroy({ where: { id } });

    return !!deletePremiumCount;
  },
  getAll: async (
    filters?: GetAllPremiumsFilters,
  ): Promise<PremiumPopulatedOutput[]> => {
    return Premium.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
      attributes: [
        'Premium.id',
        'Premium.paymentAmount',
        'Premium.paymentStatus',
        'Premium.paymentMode',
        'Premium.paymentReference',
        'Premium.createdAt',
        'Premium.updatedAt',
        'Premium.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'fullName', 'birthDate', 'phoneNumber'],
          required: true,
          on: {
            '$customer.id$': {
              [Op.eq]: Sequelize.col('Premium.customerId'),
            },
          },
        },
        {
          model: Contract,
          as: 'contract',
          attributes: [
            'id',
            'insuranceId',
            'subscriptionId',
            'contractStatus',
            'contractNumber',
          ],
          required: true,
          on: {
            '$contract.id$': {
              [Op.eq]: Sequelize.col('Premium.contractId'),
            },
          },
        },
      ],
    }) as unknown as PremiumPopulatedOutput[];
  },
};

export default PremiumDal;
