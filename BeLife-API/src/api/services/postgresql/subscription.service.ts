import SubscriptionDal from '../../../database/dal/postgresql/subscription.dal';
import {
  GetAllPaidAndAutoDebitSubscriptionsFilters,
  GetAllSubscriptionsFilters,
} from '../../../database/types';
import {
  SubscriptionInput,
  SubscriptionOutput,
  SubscriptionPopulatedOutput,
} from '../../../database/models/postgresql/subscription';

const SubscriptionService = {
  create: (payload: SubscriptionInput): Promise<SubscriptionOutput> => {
    return SubscriptionDal.create(payload);
  },
  update: (
    id: string,
    payload: Partial<SubscriptionInput>,
  ): Promise<SubscriptionOutput> => {
    return SubscriptionDal.update(id, payload);
  },
  getById: (id: string): Promise<SubscriptionPopulatedOutput> => {
    return SubscriptionDal.getById(id);
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<SubscriptionPopulatedOutput> => {
    const result = await SubscriptionDal.getByParams(name, value);
    return result;
  },
  getAllByParams: async (
    name: string,
    value: string,
  ): Promise<SubscriptionPopulatedOutput[]> => {
    const result = await SubscriptionDal.getAllByParams(name, value);
    return result;
  },
  deleteById: (id: string): Promise<boolean> => {
    return SubscriptionDal.deleteById(id);
  },
  getAll: (
    filters: GetAllSubscriptionsFilters,
  ): Promise<SubscriptionPopulatedOutput[]> => {
    return SubscriptionDal.getAll(filters);
  },
  getAllPaidAndAutoDebit: (
    filters: GetAllPaidAndAutoDebitSubscriptionsFilters,
  ): Promise<SubscriptionPopulatedOutput[]> => {
    return SubscriptionDal.getAllPaidAndAutoDebit(filters);
  },
};

export default SubscriptionService;
