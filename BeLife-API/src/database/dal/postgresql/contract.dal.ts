import { Op, Sequelize } from 'sequelize';
import Contract from '../../models/postgresql/contract';
import { GetAllContractsFilters } from '../../types';
import {
  ContractInput,
  ContractOutput,
  ContractPopulatedOutput,
} from '../../models/postgresql/contract';
import Customer from '../../models/postgresql/customer';
import Insurance from '../../models/postgresql/insurance';
import Subscription from '../../models/postgresql/subscription';
import PremiumFee from '../../models/postgresql/premiumfee';

import sequelizeLogger from '../../../../logs/sequelize';

Contract.belongsTo(Customer, { foreignKey: 'customerId', as: 'customer' });
Contract.belongsTo(Insurance, {
  foreignKey: 'insuranceId',
  as: 'insurance',
});
Contract.belongsTo(Subscription, {
  foreignKey: 'subscriptionId',
  as: 'subscription',
});

const ContractDal = {
  create: async (payload: ContractInput): Promise<ContractOutput> => {
    const contract = await Contract.create(payload);

    return contract;
  },
  update: async (
    id: string,
    payload: Partial<ContractInput>,
  ): Promise<ContractOutput> => {
    const contract = await Contract.findByPk(id);

    if (!contract) {
      sequelizeLogger.error(
        '[Sequelize - ContractDal.update()] Unable to find the contract',
      );
      throw new Error(
        `Unable to find a contract for the given identifier ${id}`,
      );
    }

    const UpdateContract = await (contract as Contract).update(payload);

    return UpdateContract;
  },
  getById: async (id: string): Promise<ContractPopulatedOutput> => {
    const contract = await Contract.findByPk(id, {
      attributes: [
        'Contract.id',
        'Contract.totalPayedPremiums',
        'Contract.contractStatus',
        'Contract.contractNumber',
        'Contract.createdAt',
        'Contract.updatedAt',
        'Contract.deletedAt',
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
              [Op.eq]: Sequelize.col('Contract.customerId'),
            },
          },
        },
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['id', 'productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Contract.insuranceId'),
            },
          },
        },
        {
          model: Subscription,
          as: 'subscription',
          attributes: ['id', 'paymentReference', 'premiumFeeId', 'createdAt'],
          include: [
            {
              model: PremiumFee,
              as: 'premiumfee',
              attributes: ['id', 'premiumFeeFormula', 'premiumMonthlyFee'],
              required: true,
            },
          ],
          required: true,
          on: {
            '$subscription.id$': {
              [Op.eq]: Sequelize.col('Contract.subscriptionId'),
            },
          },
        },
      ],
    });

    if (!contract) {
      sequelizeLogger.error(
        '[Sequelize - ContractDal.getById()] Unable to find the contract',
      );
    }

    return contract as unknown as ContractPopulatedOutput;
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<ContractPopulatedOutput> => {
    const contract = await Contract.findOne({
      where: { [name]: value },
      attributes: [
        'Contract.id',
        'Contract.totalPayedPremiums',
        'Contract.contractStatus',
        'Contract.contractNumber',
        'Contract.createdAt',
        'Contract.updatedAt',
        'Contract.deletedAt',
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
              [Op.eq]: Sequelize.col('Contract.customerId'),
            },
          },
        },
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['id', 'productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Contract.insuranceId'),
            },
          },
        },
        {
          model: Subscription,
          as: 'subscription',
          attributes: ['id', 'paymentReference', 'premiumFeeId', 'createdAt'],
          include: [
            {
              model: PremiumFee,
              as: 'premiumfee',
              attributes: ['id', 'premiumFeeFormula', 'premiumMonthlyFee'],
              required: true,
            },
          ],
          required: true,
          on: {
            '$subscription.id$': {
              [Op.eq]: Sequelize.col('Contract.subscriptionId'),
            },
          },
        },
      ],
    });

    if (!contract) {
      sequelizeLogger.error(
        '[Sequelize - ContractDal.getByParams()] Unable to find the contract',
      );
    }

    return contract as unknown as ContractPopulatedOutput;
  },
  getAllByParams: async (
    name: string,
    value: string,
  ): Promise<ContractPopulatedOutput[]> => {
    const contract = await Contract.findAll({
      where: { [name]: value },
      attributes: [
        'Contract.id',
        'Contract.totalPayedPremiums',
        'Contract.contractStatus',
        'Contract.contractNumber',
        'Contract.createdAt',
        'Contract.updatedAt',
        'Contract.deletedAt',
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
              [Op.eq]: Sequelize.col('Contract.customerId'),
            },
          },
        },
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['id', 'productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Contract.insuranceId'),
            },
          },
        },
        {
          model: Subscription,
          as: 'subscription',
          attributes: ['id', 'paymentReference', 'premiumFeeId', 'createdAt'],
          include: [
            {
              model: PremiumFee,
              as: 'premiumfee',
              attributes: ['id', 'premiumFeeFormula', 'premiumMonthlyFee'],
              required: true,
            },
          ],
          required: true,
          on: {
            '$subscription.id$': {
              [Op.eq]: Sequelize.col('Contract.subscriptionId'),
            },
          },
        },
      ],
    });

    if (!contract) {
      sequelizeLogger.error(
        '[Sequelize - ContractDal.getByParams()] Unable to find the contract',
      );
    }

    return contract as unknown as ContractPopulatedOutput[];
  },
  deleteById: async (id: string): Promise<boolean> => {
    const deleteContractCount = await Contract.destroy({ where: { id } });

    return !!deleteContractCount;
  },
  getAll: async (
    filters?: GetAllContractsFilters,
  ): Promise<ContractPopulatedOutput[]> => {
    return Contract.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
      attributes: [
        'Contract.id',
        'Contract.totalPayedPremiums',
        'Contract.contractStatus',
        'Contract.contractNumber',
        'Contract.createdAt',
        'Contract.updatedAt',
        'Contract.deletedAt',
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
              [Op.eq]: Sequelize.col('Contract.customerId'),
            },
          },
        },
        {
          model: Insurance,
          as: 'insurance',
          attributes: ['id', 'productName', 'membershipAmount'],
          required: true,
          on: {
            '$insurance.id$': {
              [Op.eq]: Sequelize.col('Contract.insuranceId'),
            },
          },
        },
        {
          model: Subscription,
          as: 'subscription',
          attributes: ['id', 'paymentReference', 'premiumFeeId', 'createdAt'],
          include: [
            {
              model: PremiumFee,
              as: 'premiumfee',
              attributes: ['id', 'premiumFeeFormula', 'premiumMonthlyFee'],
              required: true,
            },
          ],
          required: true,
          on: {
            '$subscription.id$': {
              [Op.eq]: Sequelize.col('Contract.subscriptionId'),
            },
          },
        },
      ],
    }) as unknown as ContractPopulatedOutput[];
  },
};

export default ContractDal;
