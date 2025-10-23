import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../../../../configs/sequelize';
import { UUIDTypes } from 'uuid';

interface CustomerAttributes {
  id: UUIDTypes;
  fullName: string;
  birthDate: string;
  phoneNumber: string;
  address?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomerInput
  extends Optional<
    CustomerAttributes,
    'id' | 'fullName' | 'birthDate' | 'phoneNumber'
  > {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface CustomerOutput extends Required<CustomerAttributes> {}

class Customer
  extends Model<CustomerAttributes, CustomerInput>
  implements CustomerAttributes
{
  public id!: UUIDTypes;
  public fullName!: string;
  public birthDate!: string;
  public phoneNumber!: string;
  public address!: string | null;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Customer.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    fullName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    birthDate: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'customer',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Customer',
  },
);

export default Customer;
