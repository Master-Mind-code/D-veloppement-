import UserService from '../../../services/postgresql/user.service';
import {
  UpdateUserDTO,
  CreateUserDTO,
  FilterUserDTO,
} from '../../../../database/dto/postgresql/user.dto';
import { User } from '../../../../database/interfaces/postgresql';
import UserMapper from './mapper';

const UserController = {
  create: async (payload: CreateUserDTO): Promise<Partial<User>> => {
    return UserMapper.toUser(await UserService.create(payload));
  },
  update: async (
    id: string,
    payload: UpdateUserDTO,
  ): Promise<Partial<User>> => {
    return UserMapper.toUser(await UserService.update(id, payload));
  },
  getById: async (id: string): Promise<Partial<User>> => {
    return UserMapper.toUser(await UserService.getById(id));
  },
  deleById: async (id: string): Promise<boolean> => {
    const isDeleted = await UserService.deleteById(id);

    return isDeleted;
  },
  getAll: async (filters: FilterUserDTO): Promise<Partial<User>[]> => {
    return (await UserService.getAll(filters)).map(UserMapper.toUser);
  },
};

export default UserController;
