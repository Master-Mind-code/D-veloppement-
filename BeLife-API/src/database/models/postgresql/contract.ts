/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from 'sequelize';

import { UUIDTypes } from 'uuid';

import sequelizeConnection from '../../../../configs/sequelize';
import { ContractStatus } from '../../dto/postgresql/contract.dto';
import {
  Customer,
  Insurance,
  Subscription,
  SubscriptionPopulated,
} from '../../interfaces/postgresql';
import Helper from '../../../../configs/helper';

interface ContractAttributes {
  id: UUIDTypes;
  customerId: UUIDTypes;
  insuranceId: UUIDTypes;
  subscriptionId: UUIDTypes;
  totalPayedPremiums: number;
  contractStatus: ContractStatus;
  contractNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface ContractInput
  extends Optional<
    ContractAttributes,
    | 'id'
    | 'customerId'
    | 'insuranceId'
    | 'subscriptionId'
    | 'totalPayedPremiums'
    | 'contractStatus'
    | 'contractNumber'
  > {}

export interface ContractOutput extends Required<ContractAttributes> {}

export interface ContractPopulatedOutput {
  id: UUIDTypes;
  customer: Partial<Customer>;
  insurance: Partial<Insurance>;
  subscription: Partial<SubscriptionPopulated>;
  totalPayedPremiums: number;
  contractStatus: ContractStatus;
  contractNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class Contract
  extends Model<ContractAttributes, ContractInput>
  implements ContractAttributes
{
  public id!: UUIDTypes;
  public customerId!: UUIDTypes;
  public insuranceId!: UUIDTypes;
  public subscriptionId!: UUIDTypes;
  public totalPayedPremiums!: number;
  public contractStatus!: ContractStatus;

  // Generated variable
  public contractNumber!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Contract.init(
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
    insuranceId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'insurance',
        key: 'id',
      },
    },
    subscriptionId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'subscription',
        key: 'id',
      },
    },
    totalPayedPremiums: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: 0,
      set(value: number) {
        const currentValue = this.getDataValue('totalPayedPremiums');
        const newValue = Helper.contractTotalPayedPremiumsCalculator(
          currentValue,
          value,
        );
        this.setDataValue('totalPayedPremiums', newValue);
      },
    },
    contractStatus: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: ContractStatus.Inactive,
      validate: {
        isIn: [
          [
            ContractStatus.Active,
            ContractStatus.Inactive,
            ContractStatus.Terminated,
          ],
        ],
      },
    },
    contractNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      set(value: string) {
        const contractNumber = Helper.contractNumberGenerator(value);

        this.setDataValue('contractNumber', contractNumber);
      },
    },
  },
  {
    tableName: 'contract',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Contract',
  },
);

export default Contract;
