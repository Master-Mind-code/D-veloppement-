/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../../../../configs/sequelize';

import { UUIDTypes } from 'uuid';

import { CommissionRate, Agent } from '../../interfaces/postgresql';
import { CommissionPaymentType, CommissionStatus } from '../../types';

interface CommissionAttributes {
  id: UUIDTypes;
  agentId: UUIDTypes;
  commissionRateId: UUIDTypes;
  amount: number;
  paymentType: CommissionPaymentType;
  paymentReference: string;
  status: CommissionStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CommissionInput
  extends Optional<
    CommissionAttributes,
    | 'id'
    | 'agentId'
    | 'commissionRateId'
    | 'amount'
    | 'paymentType'
    | 'paymentReference'
    | 'status'
  > {}

export interface CommissionOutput extends Required<CommissionAttributes> {}

export interface CommissionPopulatedOutput {
  id: UUIDTypes;
  agent: Partial<Agent>;
  commissionRate: Partial<CommissionRate>;
  amount: number;
  paymentType: CommissionPaymentType;
  paymentReference: string;
  status: CommissionStatus;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class Commission
  extends Model<CommissionAttributes, CommissionInput>
  implements CommissionAttributes
{
  public id!: UUIDTypes;
  public agentId!: UUIDTypes;
  public commissionRateId!: UUIDTypes;
  public amount!: number;
  public paymentType!: CommissionPaymentType;
  public paymentReference!: string;
  public status!: CommissionStatus;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Commission.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    agentId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'agent',
        key: 'id',
      },
    },
    commissionRateId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'commissionrate',
        key: 'id',
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    paymentType: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            CommissionPaymentType.Subscription,
            CommissionPaymentType.MonthlyPremium,
          ],
        ],
      },
    },
    paymentReference: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: CommissionStatus.Init,
      validate: {
        isIn: [
          [
            CommissionStatus.Init,
            CommissionStatus.Paid,
            CommissionStatus.UnPaid,
          ],
        ],
      },
    },
  },
  {
    tableName: 'commission',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Commission',
  },
);

export default Commission;
