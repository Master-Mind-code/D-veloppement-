import { Customer } from '../../../../database/interfaces/postgresql';
import { CustomerOutput } from '../../../../database/models/postgresql/customer';

const CustomerMapper = {
  toCustomer: (customer: CustomerOutput): Customer => {
    if (!customer) return customer as unknown as Customer;

    return {
      id: customer?.id,
      fullName: customer?.fullName,
      birthDate: customer?.birthDate,
      phoneNumber: customer?.phoneNumber,
      address: customer?.address,
      createdAt: customer?.createdAt,
      updatedAt: customer?.updatedAt,
      deletedAt: customer?.deletedAt,
    };
  },
};

export default CustomerMapper;
