/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../../../../configs/sequelize';

import { UUIDTypes } from 'uuid';

import { Insurance } from '../../interfaces/postgresql';
import { PremiumFeeFormula } from '../../types';

interface PremiumFeeAttributes {
  id: UUIDTypes;
  insuranceId: UUIDTypes;
  premiumFeeFormula: PremiumFeeFormula;
  premiumMonthlyFee: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface PremiumFeeInput
  extends Optional<
    PremiumFeeAttributes,
    'id' | 'insuranceId' | 'premiumFeeFormula' | 'premiumMonthlyFee'
  > {}

export interface PremiumFeeOutput extends Required<PremiumFeeAttributes> {}

export interface PremiumFeePopulatedOutput {
  id: UUIDTypes;
  insurance: Partial<Insurance>;
  premiumFeeFormula: PremiumFeeFormula;
  premiumMonthlyFee: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class PremiumFee
  extends Model<PremiumFeeAttributes, PremiumFeeInput>
  implements PremiumFeeAttributes
{
  public id!: UUIDTypes;
  public insuranceId!: UUIDTypes;
  public premiumFeeFormula!: PremiumFeeFormula;
  public premiumMonthlyFee!: number;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

PremiumFee.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    insuranceId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'insurance',
        key: 'id',
      },
    },
    premiumFeeFormula: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        isIn: [[PremiumFeeFormula.Individual, PremiumFeeFormula.Family]],
      },
    },
    premiumMonthlyFee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    tableName: 'premiumfee',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Premiumfee',
  },
);

export default PremiumFee;
