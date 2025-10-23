import { Op } from 'sequelize';
import User from '../../models/postgresql/user';
import { GetAllUsersFilters } from '../../types';
import { UserInput, UserOutput } from '../../models/postgresql/user';

const UserDal = {
  create: async (payload: UserInput): Promise<Partial<UserOutput>> => {
    const user = await User.create(payload);

    delete user.password;
    return user;
  },
  update: async (
    id: string,
    payload: Partial<UserInput>,
  ): Promise<Partial<UserOutput>> => {
    const user = await User.findByPk(id);

    if (!user) {
      // TODO throw custom error
      throw new Error('not found');
    }
    const updatedUser = await (user as User).update(payload);

    delete updatedUser.password;

    return updatedUser;
  },
  getById: async (id: string): Promise<Partial<UserOutput>> => {
    const user = await User.findByPk(id);

    if (!user) {
      // TODO throw custom error
      throw new Error('not found');
    }

    delete user.password;
    return user;
  },
  deleteById: async (id: string): Promise<boolean> => {
    const deleteUserCount = await User.destroy({ where: { id } });

    return !!deleteUserCount;
  },
  getAll: async (
    filters?: GetAllUsersFilters,
  ): Promise<Partial<UserOutput[]>> => {
    return User.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
    });
  },
};

export default UserDal;
