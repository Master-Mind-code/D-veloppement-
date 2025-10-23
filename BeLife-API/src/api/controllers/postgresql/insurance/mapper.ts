import { Insurance } from '../../../../database/interfaces/postgresql';
import { InsuranceOutput } from '../../../../database/models/postgresql/insurance';

const InsuranceMapper = {
  toInsurance: (insurance: InsuranceOutput): Insurance => {
    if (!insurance) return insurance as unknown as Insurance;

    return {
      id: insurance.id,
      productName: insurance.productName,
      type: insurance.type,
      description: insurance.description,
      membershipAmount: insurance.membershipAmount,
      createdAt: insurance.createdAt,
      updatedAt: insurance.updatedAt,
      deletedAt: insurance.deletedAt,
    };
  },
};

export default InsuranceMapper;
