/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../../../../configs/sequelize';

import { UUIDTypes } from 'uuid';

interface MunicipalityAttributes {
  id: UUIDTypes;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface MunicipalityInput
  extends Optional<MunicipalityAttributes, 'id' | 'name'> {}

export interface MunicipalityOutput extends Required<MunicipalityAttributes> {}

class Municipality
  extends Model<MunicipalityAttributes, MunicipalityInput>
  implements MunicipalityAttributes
{
  public id!: UUIDTypes;
  public name!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Municipality.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: 'municipality',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Municipality',
  },
);

export default Municipality;
