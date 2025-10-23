import CustomerDal from '../../../database/dal/postgresql/customer.dal';
import { GetAllCustomersFilters } from '../../../database/types';
import {
  CustomerInput,
  CustomerOutput,
} from '../../../database/models/postgresql/customer';

const CustomerService = {
  create: (payload: CustomerInput): Promise<CustomerOutput> => {
    return CustomerDal.create(payload);
  },
  update: (
    id: string,
    payload: Partial<CustomerInput>,
  ): Promise<CustomerOutput> => {
    return CustomerDal.update(id, payload);
  },
  getById: (id: string): Promise<CustomerOutput> => {
    return CustomerDal.getById(id);
  },
  getByParams: async (name: string, value: string): Promise<CustomerOutput> => {
    return await CustomerDal.getByParams(name, value);
  },
  deleteById: (id: string): Promise<boolean> => {
    return CustomerDal.deleteById(id);
  },
  getAll: (filters: GetAllCustomersFilters): Promise<CustomerOutput[]> => {
    return CustomerDal.getAll(filters);
  },
};

export default CustomerService;
