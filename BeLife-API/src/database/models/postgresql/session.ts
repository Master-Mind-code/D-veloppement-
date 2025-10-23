import { DataTypes, Model, Optional } from 'sequelize';
import sequelizeConnection from '../../../../configs/sequelize';

interface SessionAttributes {
  sid: string;
  expires: Date;
  data: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SessionInput
  extends Optional<SessionAttributes, 'sid' | 'expires' | 'data'> {}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SessionOutput extends Required<SessionAttributes> {}

class Session
  extends Model<SessionAttributes, SessionInput>
  implements SessionAttributes
{
  public sid!: string;
  public expires!: Date;
  public data!: string;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

Session.init(
  {
    sid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data: {
      type: DataTypes.TEXT,
    },
  },
  {
    tableName: 'Sessions',
    timestamps: true,
    sequelize: sequelizeConnection,
    paranoid: true,
    modelName: 'Session',
  },
);

export default Session;
