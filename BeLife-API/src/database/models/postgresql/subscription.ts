import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../../../../configs/sequelize';

import { UUIDTypes } from 'uuid';

import { PaymentStatus, PaymentMode } from '../../types';
import {
  Customer,
  Beneficiary,
  Insurance,
  PremiumFee,
} from '../../interfaces/postgresql';

interface SubscriptionAttributes {
  id: UUIDTypes;
  customerId: UUIDTypes;
  beneficiaryId: UUIDTypes;
  insuranceId: UUIDTypes;
  premiumFeeId: UUIDTypes;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  paymentReference: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SubscriptionInput
  extends Optional<
    SubscriptionAttributes,
    | 'id'
    | 'customerId'
    | 'beneficiaryId'
    | 'insuranceId'
    | 'premiumFeeId'
    | 'paymentMode'
    | 'paymentStatus'
    | 'paymentReference'
  > {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SubscriptionOutput extends Required<SubscriptionAttributes> {}

export interface SubscriptionPopulatedOutput {
  id: UUIDTypes;
  customer: Partial<Customer>;
  beneficiary: Partial<Beneficiary>;
  insurance: Partial<Insurance>;
  premiumFee: Partial<PremiumFee>;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  paymentReference: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class Subscription
  extends Model<SubscriptionAttributes, SubscriptionInput>
  implements SubscriptionAttributes
{
  public id!: UUIDTypes;
  public customerId!: UUIDTypes;
  public beneficiaryId!: UUIDTypes;
  public insuranceId!: UUIDTypes;
  public premiumFeeId!: UUIDTypes;
  public paymentMode!: PaymentMode;
  public paymentStatus!: PaymentStatus;
  public paymentReference!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Subscription.init(
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
    beneficiaryId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'beneficiary',
        key: 'id',
      },
    },
    insuranceId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'insurance',
        key: 'id',
      },
    },
    premiumFeeId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'premiumfee',
        key: 'id',
      },
    },
    paymentMode: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [[PaymentMode.Auto, PaymentMode.Manual]],
      },
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
    paymentReference: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: 'subscription',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Subscription',
  },
);

export default Subscription;
