import { Op, Sequelize } from 'sequelize';
import Agent, { AgentPopulatedOuput } from '../../models/postgresql/agent';
import { GetAllAgentFilters } from '../../types';
import { AgentInput, AgentOutput } from '../../models/postgresql/agent';

import Helper from '../../../../configs/helper';
import sequelizeLogger from '../../../../logs/sequelize';

import Municipality from '../../models/postgresql/municipality';
import Team from '../../models/postgresql/team';

Agent.belongsTo(Municipality, {
  foreignKey: 'municipalityId',
  as: 'municipality',
});

Agent.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });

const AgentDal = {
  create: async (payload: AgentInput): Promise<AgentOutput> => {
    const agent = await Agent.create(payload);

    return agent;
  },
  update: async (
    id: string,
    payload: Partial<AgentInput>,
  ): Promise<AgentOutput> => {
    const agent = await Agent.findByPk(id);

    if (!Helper.hasNonNullValue(agent, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - AgentDal.update()] No record matches the provided id ${id}`,
      );
    }

    const updateAgent = await (agent as Agent).update(payload);

    return updateAgent;
  },
  getById: async (id: string): Promise<AgentPopulatedOuput> => {
    const agent = await Agent.findByPk(id, {
      attributes: [
        'Agent.id',
        'Agent.fullName',
        'Agent.phoneNumber',
        'Agent.createdAt',
        'Agent.updatedAt',
        'Agent.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Municipality,
          as: 'municipality',
          attributes: ['id', 'name'],
          required: true,
          on: {
            '$municipality.id$': {
              [Op.eq]: Sequelize.col('Agent.municipalityId'),
            },
          },
        },
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'teamName', 'supervisorName'],
          required: true,
          on: {
            '$team.id$': {
              [Op.eq]: Sequelize.col('Agent.teamId'),
            },
          },
        },
      ],
    });

    if (!Helper.hasNonNullValue(agent, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - AgentDal.getById()] No record matches the provided id ${id}`,
      );
    }

    return agent as unknown as AgentPopulatedOuput;
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<AgentPopulatedOuput> => {
    const agent = await Agent.findOne({
      where: { [name]: value },
      attributes: [
        'Agent.id',
        'Agent.fullName',
        'Agent.phoneNumber',
        'Agent.createdAt',
        'Agent.updatedAt',
        'Agent.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Municipality,
          as: 'municipality',
          attributes: ['id', 'name'],
          required: true,
          on: {
            '$municipality.id$': {
              [Op.eq]: Sequelize.col('Agent.municipalityId'),
            },
          },
        },
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'teamName', 'supervisorName'],
          required: true,
          on: {
            '$team.id$': {
              [Op.eq]: Sequelize.col('Agent.teamId'),
            },
          },
        },
      ],
    });

    if (!Helper.hasNonNullValue(agent, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - AgentDal.getByParams()] No record matches the provided ${name}: ${value}`,
      );
    }

    return agent as unknown as AgentPopulatedOuput;
  },
  deleteById: async (id: string): Promise<boolean> => {
    const deleteAgentCount = await Agent.destroy({ where: { id } });

    return !!deleteAgentCount;
  },
  getAll: async (
    filters?: GetAllAgentFilters,
  ): Promise<AgentPopulatedOuput[]> => {
    return Agent.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
      attributes: [
        'Agent.id',
        'Agent.fullName',
        'Agent.phoneNumber',
        'Agent.createdAt',
        'Agent.updatedAt',
        'Agent.deletedAt',
      ],
      raw: true,
      include: [
        {
          model: Municipality,
          as: 'municipality',
          attributes: ['id', 'name'],
          required: true,
          on: {
            '$municipality.id$': {
              [Op.eq]: Sequelize.col('Agent.municipalityId'),
            },
          },
        },
        {
          model: Team,
          as: 'team',
          attributes: ['id', 'teamName', 'supervisorName'],
          required: true,
          on: {
            '$team.id$': {
              [Op.eq]: Sequelize.col('Agent.teamId'),
            },
          },
        },
      ],
    }) as unknown as AgentPopulatedOuput[];
  },
};

export default AgentDal;
