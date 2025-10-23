import UserDal from '../../../database/dal/postgresql/user.dal';
import { GetAllUsersFilters } from '../../../database/types';
import {
  UserInput,
  UserOutput,
} from '../../../database/models/postgresql/user';

const UserService = {
  create: (payload: UserInput): Promise<Partial<UserOutput>> => {
    return UserDal.create(payload);
  },
  update: (
    id: string,
    payload: Partial<UserInput>,
  ): Promise<Partial<UserOutput>> => {
    return UserDal.update(id, payload);
  },
  getById: (id: string): Promise<Partial<UserOutput>> => {
    return UserDal.getById(id);
  },
  deleteById: (id: string): Promise<boolean> => {
    return UserDal.deleteById(id);
  },
  getAll: (filters: GetAllUsersFilters): Promise<Partial<UserOutput[]>> => {
    return UserDal.getAll(filters);
  },
};

export default UserService;
