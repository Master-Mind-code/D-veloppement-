import { Op } from 'sequelize';
import Municipality from '../../models/postgresql/municipality';
import { GetAllMunicipalityFilters } from '../../types';
import {
  MunicipalityInput,
  MunicipalityOutput,
} from '../../models/postgresql/municipality';
import Helper from '../../../../configs/helper';
import sequelizeLogger from '../../../../logs/sequelize';

const MunicipalityDal = {
  create: async (payload: MunicipalityInput): Promise<MunicipalityOutput> => {
    const municipality = await Municipality.create(payload);

    return municipality;
  },
  update: async (
    id: string,
    payload: Partial<MunicipalityInput>,
  ): Promise<MunicipalityOutput> => {
    const municipality = await Municipality.findByPk(id);

    if (!Helper.hasNonNullValue(municipality, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - MunicipalityDal.update()] No record matches the provided id ${id}`,
      );
    }

    const updateMunicipality = await (municipality as Municipality).update(
      payload,
    );

    return updateMunicipality;
  },
  getById: async (id: string): Promise<MunicipalityOutput> => {
    const municipality = await Municipality.findByPk(id);

    if (!Helper.hasNonNullValue(municipality, 'id')) {
      sequelizeLogger.error(
        `[Sequelize - MunicipalityDal.getById()] No record matches the provided id ${id}`,
      );
    }

    return municipality;
  },
  deleteById: async (id: string): Promise<boolean> => {
    // TODO Before deleting municipaly we need to checkout if there is no agent bound to it.
    // Do not forgot to delete also commission owned by the agent if needed
    const deleteMunicipalityCount = await Municipality.destroy({
      where: { id },
    });

    return !!deleteMunicipalityCount;
  },
  getAll: async (
    filters?: GetAllMunicipalityFilters,
  ): Promise<MunicipalityOutput[]> => {
    return Municipality.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
    });
  },
};

export default MunicipalityDal;
