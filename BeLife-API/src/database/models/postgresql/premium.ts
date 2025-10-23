import { DataTypes, Model, Optional } from 'sequelize';
import { UUIDTypes } from 'uuid';

import sequelizeConnection from '../../../../configs/sequelize';

import { PaymentMode, PaymentStatus } from '../../types';
import { Customer, Contract } from '../../interfaces/postgresql';

interface PremiumAttributes {
  id: UUIDTypes;
  customerId: UUIDTypes;
  contractId: UUIDTypes;
  paymentAmount: number;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  paymentReference: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PremiumInput
  extends Optional<
    PremiumAttributes,
    | 'id'
    | 'customerId'
    | 'contractId'
    | 'paymentAmount'
    | 'paymentStatus'
    | 'paymentMode'
  > {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface PremiumOutput extends Required<PremiumAttributes> {}

export interface PremiumPopulatedOutput {
  id: UUIDTypes;
  customer: Partial<Customer>;
  contract: Partial<Contract>;
  paymentAmount: number;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
  paymentReference: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class Premium
  extends Model<PremiumAttributes, PremiumInput>
  implements PremiumAttributes
{
  public id!: UUIDTypes;
  public customerId!: UUIDTypes;
  public contractId!: UUIDTypes;
  public paymentAmount!: number;
  public paymentStatus!: PaymentStatus;
  public paymentMode!: PaymentMode;
  public paymentReference!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Premium.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    customerId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'customer',
        key: 'id',
      },
    },
    contractId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'contract',
        key: 'id',
      },
    },
    paymentAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    paymentStatus: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: PaymentStatus.Pending,
      validate: {
        isIn: [
          [
            PaymentStatus.Pending,
            PaymentStatus.Failed,
            PaymentStatus.Successful,
          ],
        ],
      },
    },
    paymentMode: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: PaymentMode.Manual,
      validate: {
        isIn: [[PaymentMode.Auto, PaymentMode.Manual]],
      },
    },
    paymentReference: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: 'premium',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Premium',
  },
);

export default Premium;
