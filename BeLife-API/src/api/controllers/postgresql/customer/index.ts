import CustomerService from '../../../services/postgresql/customer.service';
import {
  CreateCustomerDTO,
  UpdateCustomerDTO,
  FilterCustomersDTO,
} from '../../../../database/dto/postgresql/customer.dto';
import { Customer } from '../../../../database/interfaces/postgresql';
import CustomerMapper from './mapper';

const CustomerController = {
  create: async (payload: CreateCustomerDTO): Promise<Customer> => {
    return CustomerMapper.toCustomer(await CustomerService.create(payload));
  },
  update: async (id: string, payload: UpdateCustomerDTO): Promise<Customer> => {
    return CustomerMapper.toCustomer(await CustomerService.update(id, payload));
  },
  getById: async (id: string): Promise<Customer> => {
    return CustomerMapper.toCustomer(await CustomerService.getById(id));
  },
  getByParams: async (name: string, value: string): Promise<Customer> => {
    return CustomerMapper.toCustomer(
      await CustomerService.getByParams(name, value),
    );
  },
  deleteById: async (id: string): Promise<boolean> => {
    const isDeleted = await CustomerService.deleteById(id);

    return isDeleted;
  },
  getAll: async (filters: FilterCustomersDTO): Promise<Customer[]> => {
    return (await CustomerService.getAll(filters)).map(
      CustomerMapper.toCustomer,
    );
  },
};

export default CustomerController;
