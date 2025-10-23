import SubscriptionService from '../../../services/postgresql/subscription.service';
import {
  CreateSubscriptionDTO,
  UpdateSubscriptionDTO,
  FilterSusbscriptionsDTO,
  FilterPaidAutoDebitSusbscriptionsDTO,
} from '../../../../database/dto/postgresql/subscription.dto';
import {
  Subscription,
  SubscriptionPopulated,
} from '../../../../database/interfaces/postgresql';
import SubscriptionMapper, { SubscriptionPopulatedMapper } from './mapper';

const SubscriptionController = {
  create: async (payload: CreateSubscriptionDTO): Promise<Subscription> => {
    return SubscriptionMapper.toSubscription(
      await SubscriptionService.create(payload),
    );
  },
  update: async (
    id: string,
    payload: UpdateSubscriptionDTO,
  ): Promise<Subscription> => {
    return SubscriptionMapper.toSubscription(
      await SubscriptionService.update(id, payload),
    );
  },
  getById: async (id: string): Promise<SubscriptionPopulated> => {
    const result = await SubscriptionService.getById(id);
    return SubscriptionPopulatedMapper.toSubscription(result);
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<SubscriptionPopulated> => {
    const result = await SubscriptionService.getByParams(name, value);
    return SubscriptionPopulatedMapper.toSubscription(result);
  },
  getAllByParams: async (
    name: string,
    value: string,
  ): Promise<SubscriptionPopulated[]> => {
    const result = await SubscriptionService.getAllByParams(name, value);
    return result.map(SubscriptionPopulatedMapper.toSubscription);
  },
  deleteById: async (id: string): Promise<boolean> => {
    const isDeleted = await SubscriptionService.deleteById(id);

    return isDeleted;
  },
  getAll: async (
    filters: FilterSusbscriptionsDTO,
  ): Promise<SubscriptionPopulated[]> => {
    return (await SubscriptionService.getAll(filters)).map(
      SubscriptionPopulatedMapper.toSubscription,
    );
  },
  getAllPaidAndAutoDebit: async (
    filters: FilterPaidAutoDebitSusbscriptionsDTO,
  ): Promise<SubscriptionPopulated[]> => {
    return (await SubscriptionService.getAllPaidAndAutoDebit(filters)).map(
      SubscriptionPopulatedMapper.toSubscription,
    );
  },
};

export default SubscriptionController;
