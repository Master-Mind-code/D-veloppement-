/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../../../../configs/sequelize';

import { UUIDTypes } from 'uuid';
import { CommissionPaymentType } from '../../types';

interface CommissionRateAttributes {
  id: UUIDTypes;
  type: CommissionPaymentType;
  rate: number;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface CommissionRateInput
  extends Optional<
    CommissionRateAttributes,
    'id' | 'type' | 'rate' | 'startDate' | 'endDate'
  > {}

export interface CommissionRateOuptut
  extends Required<CommissionRateAttributes> {}

class CommissionRate
  extends Model<CommissionRateAttributes, CommissionRateInput>
  implements CommissionRateAttributes
{
  public id!: UUIDTypes;
  public type!: CommissionPaymentType;
  public rate!: number;
  public startDate!: Date;
  public endDate!: Date;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

CommissionRate.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [
          [
            CommissionPaymentType.MonthlyPremium,
            CommissionPaymentType.Subscription,
          ],
        ],
      },
    },
    rate: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    tableName: 'commissionrate',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Commissionrate',
    indexes: [
      {
        unique: true,
        fields: ['type', 'startDate'],
      },
    ],
  },
);

export default CommissionRate;
