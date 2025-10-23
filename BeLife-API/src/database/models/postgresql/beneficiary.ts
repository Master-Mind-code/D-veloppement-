import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../../../../configs/sequelize';
import { UUIDTypes } from 'uuid';

interface BeneficiaryAttributes {
  id: UUIDTypes;
  fullName: string;
  phoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BeneficiaryInput
  extends Optional<BeneficiaryAttributes, 'id' | 'fullName' | 'phoneNumber'> {}
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface BeneficiaryOutput extends Required<BeneficiaryAttributes> {}

class Beneficiary
  extends Model<BeneficiaryAttributes, BeneficiaryInput>
  implements BeneficiaryAttributes
{
  public id!: UUIDTypes;
  public fullName!: string;
  public phoneNumber!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Beneficiary.init(
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
    phoneNumber: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'beneficiary',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Beneficiary',
  },
);

export default Beneficiary;
