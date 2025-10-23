import { User } from '../../../../database/interfaces/postgresql';
import { UserOutput } from '../../../../database/models/postgresql/user';

const UserMapper = {
  toUser: (user: Partial<UserOutput>): Partial<User> => {
    if (!user) return user as unknown as Partial<User>;

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  },
};

export default UserMapper;
