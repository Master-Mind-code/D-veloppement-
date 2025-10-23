import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../../../../configs/sequelize';

import { UUIDTypes } from 'uuid';

interface InsuranceAttributes {
  id: UUIDTypes;
  productName: string;
  type: string;
  description: string;
  membershipAmount: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InsuranceInput
  extends Optional<
    InsuranceAttributes,
    'id' | 'productName' | 'type' | 'description' | 'membershipAmount'
  > {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InsuranceOutput extends Required<InsuranceAttributes> {}

class Insurance
  extends Model<InsuranceAttributes, InsuranceInput>
  implements InsuranceAttributes
{
  public id!: UUIDTypes;
  public productName!: string;
  public type!: string;
  public description!: string;
  public membershipAmount!: number;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Insurance.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    productName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    type: { type: DataTypes.STRING, allowNull: false },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    membershipAmount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'insurance',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Insurance',
  },
);

export default Insurance;
