import { Op } from 'sequelize';
import Customer from '../../models/postgresql/customer';
import { GetAllCustomersFilters } from '../../types';
import {
  CustomerInput,
  CustomerOutput,
} from '../../models/postgresql/customer';
import sequelizeLogger from '../../../../logs/sequelize';

const CustomerDal = {
  create: async (payload: CustomerInput): Promise<CustomerOutput> => {
    const customer = await Customer.create(payload);

    return customer;
  },
  update: async (
    id: string,
    payload: Partial<CustomerInput>,
  ): Promise<CustomerOutput> => {
    const customer = await Customer.findByPk(id);

    if (!customer) {
      // TODO throw custom error
      throw new Error('not found');
    }
    const updatedCustomer = await (customer as Customer).update(payload);

    return updatedCustomer;
  },
  getById: async (id: string): Promise<CustomerOutput> => {
    const customer = await Customer.findByPk(id);

    if (!customer) {
      // TODO throw custom error
      throw new Error('not found');
    }

    return customer;
  },
  getByParams: async (name: string, value: string): Promise<CustomerOutput> => {
    const customer = await Customer.findOne({ where: { [name]: value } });

    if (!customer) {
      sequelizeLogger.error(
        '[Sequelize - CustomerDal.getByParams()] Unable to find customer.',
      );
    }

    return customer;
  },
  deleteById: async (id: string): Promise<boolean> => {
    const deleteCustomerCount = await Customer.destroy({ where: { id } });

    return !!deleteCustomerCount;
  },
  getAll: async (
    filters?: GetAllCustomersFilters,
  ): Promise<CustomerOutput[]> => {
    return Customer.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
    });
  },
};

export default CustomerDal;
