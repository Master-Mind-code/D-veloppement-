/* eslint-disable @typescript-eslint/no-empty-object-type */
import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../../../../configs/sequelize';

import { UUIDTypes } from 'uuid';

import { Municipality, Team } from '../../interfaces/postgresql';

interface AgentAttributes {
  id: UUIDTypes;
  municipalityId: UUIDTypes;
  teamId: UUIDTypes;
  fullName: string;
  phoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export interface AgentInput
  extends Optional<
    AgentAttributes,
    'id' | 'municipalityId' | 'teamId' | 'fullName' | 'phoneNumber'
  > {}

export interface AgentOutput extends Required<AgentAttributes> {}

export interface AgentPopulatedOuput {
  id: UUIDTypes;
  municipality: Partial<Municipality>;
  team: Partial<Team>;
  fullName: string;
  phoneNumber: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

class Agent
  extends Model<AgentAttributes, AgentInput>
  implements AgentAttributes
{
  public id!: UUIDTypes;
  public municipalityId!: UUIDTypes;
  public teamId!: UUIDTypes;
  public fullName!: string;
  public phoneNumber!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Agent.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    municipalityId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'municipality',
        key: 'id',
      },
    },
    teamId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      references: {
        model: 'team',
        key: 'id',
      },
    },
    fullName: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.TEXT,
      unique: true,
      allowNull: false,
    },
  },
  {
    tableName: 'agent',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Agent',
  },
);

export default Agent;
