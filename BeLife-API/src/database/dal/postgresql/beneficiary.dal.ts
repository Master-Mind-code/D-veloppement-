import { Op } from 'sequelize';
import Beneficiary from '../../models/postgresql/beneficiary';
import { GetAllBeneficiariesFilters } from '../../types';
import {
  BeneficiaryInput,
  BeneficiaryOutput,
} from '../../models/postgresql/beneficiary';
import sequelizeLogger from '../../../../logs/sequelize';

const BeneficiaryDal = {
  create: async (payload: BeneficiaryInput): Promise<BeneficiaryOutput> => {
    const beneficiary = await Beneficiary.create(payload);

    return beneficiary;
  },
  update: async (
    id: string,
    payload: Partial<BeneficiaryInput>,
  ): Promise<BeneficiaryOutput> => {
    const beneficiary = await Beneficiary.findByPk(id);

    if (!beneficiary) {
      // TODO throw custom error
      throw new Error('not found');
    }
    const updateBeneficiary = await (beneficiary as Beneficiary).update(
      payload,
    );

    return updateBeneficiary;
  },
  getById: async (id: string): Promise<BeneficiaryOutput> => {
    const beneficiary = await Beneficiary.findByPk(id);

    if (!beneficiary) {
      // TODO throw custom error
      throw new Error('not found');
    }

    return beneficiary;
  },
  getByParams: async (
    name: string,
    value: string,
  ): Promise<BeneficiaryOutput> => {
    const beneficiary = await Beneficiary.findOne({ where: { [name]: value } });

    if (!beneficiary) {
      sequelizeLogger.error(
        '[Sequelize - BeneficiaryDal.getByParams()] Unable to find beneficiary.',
      );
    }

    return beneficiary;
  },
  deleteById: async (id: string): Promise<boolean> => {
    const deleteBeneficiaryCount = await Beneficiary.destroy({ where: { id } });

    return !!deleteBeneficiaryCount;
  },
  getAll: async (
    filters?: GetAllBeneficiariesFilters,
  ): Promise<BeneficiaryOutput[]> => {
    return Beneficiary.findAll({
      where: {
        ...(filters?.isDeleted && { deletedAt: { [Op.not]: null } }),
      },
      ...((filters?.isDeleted || filters?.includeDeleted) && {
        paranoid: true,
      }),
    });
  },
};

export default BeneficiaryDal;
