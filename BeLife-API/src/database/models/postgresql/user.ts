import { UUIDTypes } from 'uuid';
import bcrypt from 'bcryptjs';
import { DataTypes, Model, Optional } from 'sequelize';

import sequelizeConnection from '../../../../configs/sequelize';
import { UserRole } from '../../dto/postgresql/user.dto';

interface UserAttributes {
  id: UUIDTypes;
  fullName: string;
  email: string;
  role: UserRole;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserInput
  extends Optional<UserAttributes, 'id' | 'fullName' | 'email' | 'password'> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UserOutput extends Required<UserAttributes> {}

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
  public id!: UUIDTypes;
  public fullName!: string;
  public email!: string;
  public role!: UserRole;
  public password!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;

  public comparePassowrd = (
    password: string,
    callback: (arg0: Error, arg1?: boolean) => void,
  ) => {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if (err) {
        return callback(err);
      }
      callback(null, isMatch);
    });
  };
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [[UserRole.Admin, UserRole.Developer, UserRole.Staff]],
      },
      defaultValue: UserRole.Staff,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'user',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'User',
  },
);

// It will convert each password into the Hashed String for maintaining the security
User.beforeSave((user) => {
  if (user.changed('password')) {
    user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
  }
});

export default User;
