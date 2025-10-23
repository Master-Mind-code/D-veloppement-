/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../../../../configs/sequelize';

import { UUIDTypes } from 'uuid';

interface TeamAttributes {
  id: UUIDTypes;
  teamName: string;
  supervisorName: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface TeamInput
  extends Optional<TeamAttributes, 'id' | 'teamName' | 'supervisorName'> {}

export interface TeamOutput extends Required<TeamAttributes> {}

class Team extends Model<TeamAttributes, TeamInput> implements TeamAttributes {
  public id!: UUIDTypes;
  public teamName!: string;
  public supervisorName!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Team.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    teamName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    supervisorName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'team',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Team',
  },
);

export default Team;
