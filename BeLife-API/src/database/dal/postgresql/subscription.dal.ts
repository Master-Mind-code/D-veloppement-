import { Op, Sequelize } from 'sequelize';
import Subscription from '../../models/postgresql/subscription';
import {
  GetAllSubscriptionsFilters,
  GetAllPaidAndAutoDebitSubscriptionsFilters,
} from '../../types';
import {
  SubscriptionInput,
  SubscriptionOutput,
  SubscriptionPopulatedOutput,
} from '../../models/postgresql/subscription';
import Customer from '../../models/postgresql/customer';
import Beneficiary from '../../models/postgresql/beneficiary';
import Insurance from '../../models/postgresql/insurance';
import PremiumFee from '../../models/postgresql/premiumfee';
import sequelizeLogger from '../../../../logs/sequelize';

Subscription.belongsTo(Customer, {
  foreignKey: 'customerId',
  as: 'customer',
});
Subscription.belongsTo(Beneficiary, {
  foreignKey: 'beneficiaryId',
  as: 'beneficiary',
});
Subscription.belongsTo(Insurance, {
  foreignKey: 'insuranceId',
  as: 'insurance',
});
Subscription.belongsTo(PremiumFee, {
  foreignKey: 'premiumFeeId',
  as: 'premiumfee',
});

const SubscriptionDal = {
  create: async (payload: SubscriptionInput): Promise<SubscriptionOutput> => {
    const subscription = await Subscription.create(payload);

    return subscription;
  },
  update: async (
    id: string,
    payload: Partial<SubscriptionInput>,
  ): Promise<SubscriptionOutput> => {
    const subscription = await Subscription.findByPk(id);

    if (!subscription) {
      // TODO throw custom error
      throw new Error('not found');
    }
    const updateSubscription = await (subscription as Subscription).update(
      payload,
    );

    return updateSubscription;
  },
  getById: async (id: string): Promise<SubscriptionPopulatedOutput> => {
    const subscription = await Subscription.findByPk(id, {
      attributes: [
        'Subscription.id',
        'Subscription.paymentMode',
        'Subscription.paymentReference',
        'Subscription.paymentStatus',
        'Subscription.createdAt',
        'Subscription.updatedAt',
        'Subscription.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['fullName', 'birthDate', 'phoneNumber'],
          required: true,
          on: {
            '$customer.id$': {
              [Op.eq]: Sequelize.col('Subscription.customerId'),
            },
          },
        },
        {
          model: Beneficiary,
          as: 'beneficiary',
          attributes: ['fullName', 'phoneNumber'],
          required: true,
          on: {
            '$beneficiary.id$': {
              [Op.eq]: Sequelize.col('Subscription.beneficiaryId'),
            },
          },
        },
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Subscription.insuranceId'),
            },
          },
        },
        {
          model: PremiumFee,
          as: 'premiumfee',
          attributes: ['id', 'premiumFeeFormula', 'premiumMonthlyFee'],
          required: true,
          on: {
            '$premiumfee.id$': {
              [Op.eq]: Sequelize.col('Subscription.premiumFeeId'),
            },
          },
        },
      ],
    });

    if (!subscription) {
      // TODO throw custom error
      throw new Error('not found');
    }

    return subscription as unknown as SubscriptionPopulatedOutput;
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<SubscriptionPopulatedOutput> => {
    const subscription = await Subscription.findOne({
      where: { [name]: value },
      attributes: [
        'Subscription.id',
        'Subscription.paymentMode',
        'Subscription.paymentReference',
        'Subscription.paymentStatus',
        'Subscription.createdAt',
        'Subscription.updatedAt',
        'Subscription.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['fullName', 'birthDate', 'phoneNumber'],
          required: true,
          on: {
            '$customer.id$': {
              [Op.eq]: Sequelize.col('Subscription.customerId'),
            },
          },
        },
        {
          model: Beneficiary,
          as: 'beneficiary',
          attributes: ['fullName', 'phoneNumber'],
          required: true,
          on: {
            '$beneficiary.id$': {
              [Op.eq]: Sequelize.col('Subscription.beneficiaryId'),
            },
          },
        },
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Subscription.insuranceId'),
            },
          },
        },
        {
          model: PremiumFee,
          as: 'premiumfee',
          attributes: ['id', 'premiumFeeFormula', 'premiumMonthlyFee'],
          required: true,
          on: {
            '$premiumfee.id$': {
              [Op.eq]: Sequelize.col('Subscription.premiumFeeId'),
            },
          },
        },
      ],
    });

    if (!subscription) {
      sequelizeLogger.error(
        '[Sequelize - SubscriptionDal.getByParams()] Unable to find subscription',
      );
    }

    return subscription as unknown as SubscriptionPopulatedOutput;
  },
  getAllByParams: async (
    name: string,
    value: string,
  ): Promise<SubscriptionPopulatedOutput[]> => {
    const subscription = await Subscription.findAll({
      where: { [name]: value },
      attributes: [
        'Subscription.id',
        'Subscription.paymentMode',
        'Subscription.paymentReference',
        'Subscription.paymentStatus',
        'Subscription.createdAt',
        'Subscription.updatedAt',
        'Subscription.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['fullName', 'birthDate', 'phoneNumber'],
          required: true,
          on: {
            '$customer.id$': {
              [Op.eq]: Sequelize.col('Subscription.customerId'),
            },
          },
        },
        {
          model: Beneficiary,
          as: 'beneficiary',
          attributes: ['fullName', 'phoneNumber'],
          required: true,
          on: {
            '$beneficiary.id$': {
              [Op.eq]: Sequelize.col('Subscription.beneficiaryId'),
            },
          },
        },
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Subscription.insuranceId'),
            },
          },
        },
        {
          model: PremiumFee,
          as: 'premiumfee',
          attributes: ['id', 'premiumFeeFormula', 'premiumMonthlyFee'],
          required: true,
          on: {
            '$premiumfee.id$': {
              [Op.eq]: Sequelize.col('Subscription.premiumFeeId'),
            },
          },
        },
      ],
    });

    if (!subscription) {
      sequelizeLogger.error(
        '[Sequelize - SubscriptionDal.getByParams()] Unable to find subscription: ',
      );
    }

    return subscription as unknown as SubscriptionPopulatedOutput[];
  },
  deleteById: async (id: string): Promise<boolean> => {
    const deleteSubscriptionCount = await Subscription.destroy({
      where: { id },
    });

    return !!deleteSubscriptionCount;
  },
  getAll: async (
    filters?: GetAllSubscriptionsFilters,
  ): Promise<SubscriptionPopulatedOutput[]> => {
    return Subscription.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
      attributes: [
        'Subscription.id',
        'Subscription.paymentMode',
        'Subscription.paymentReference',
        'Subscription.paymentStatus',
        'Subscription.createdAt',
        'Subscription.updatedAt',
        'Subscription.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['fullName', 'birthDate', 'phoneNumber'],
          required: true,
          on: {
            '$customer.id$': {
              [Op.eq]: Sequelize.col('Subscription.customerId'),
            },
          },
        },
        {
          model: Beneficiary,
          as: 'beneficiary',
          attributes: ['fullName', 'phoneNumber'],
          required: true,
          on: {
            '$beneficiary.id$': {
              [Op.eq]: Sequelize.col('Subscription.beneficiaryId'),
            },
          },
        },
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Subscription.insuranceId'),
            },
          },
        },
        {
          model: PremiumFee,
          as: 'premiumfee',
          attributes: ['id', 'premiumFeeFormula', 'premiumMonthlyFee'],
          required: true,
          on: {
            '$premiumfee.id$': {
              [Op.eq]: Sequelize.col('Subscription.premiumFeeId'),
            },
          },
        },
      ],
    }) as unknown as SubscriptionPopulatedOutput[];
  },
  getAllPaidAndAutoDebit: async (
    filters?: GetAllPaidAndAutoDebitSubscriptionsFilters,
  ): Promise<SubscriptionPopulatedOutput[]> => {
    return Subscription.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
        paymentMode: filters.paymentMode,
        paymentStatus: filters.paymentStatus,
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
      attributes: [
        'Subscription.id',
        'Subscription.paymentMode',
        'Subscription.paymentReference',
        'Subscription.paymentStatus',
        'Subscription.createdAt',
        'Subscription.updatedAt',
        'Subscription.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['fullName', 'birthDate', 'phoneNumber'],
          required: true,
          on: {
            '$customer.id$': {
              [Op.eq]: Sequelize.col('Subscription.customerId'),
            },
          },
        },
        {
          model: Beneficiary,
          as: 'beneficiary',
          attributes: ['fullName', 'phoneNumber'],
          required: true,
          on: {
            '$beneficiary.id$': {
              [Op.eq]: Sequelize.col('Subscription.beneficiaryId'),
            },
          },
        },
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Subscription.insuranceId'),
            },
          },
        },
        {
          model: PremiumFee,
          as: 'premiumfee',
          attributes: ['id', 'premiumFeeFormula', 'premiumMonthlyFee'],
          required: true,
          on: {
            '$premiumfee.id$': {
              [Op.eq]: Sequelize.col('Subscription.premiumFeeId'),
            },
          },
        },
      ],
    }) as unknown as SubscriptionPopulatedOutput[];
  },
};

export default SubscriptionDal;
