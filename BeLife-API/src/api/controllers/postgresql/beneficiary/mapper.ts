import { Beneficiary } from '../../../../database/interfaces/postgresql';
import { BeneficiaryOutput } from '../../../../database/models/postgresql/beneficiary';

const BeneficiaryMapper = {
  toBeneficiary: (beneficiary: BeneficiaryOutput): Beneficiary => {
    if (!beneficiary) return beneficiary as unknown as Beneficiary;
    
    return {
      id: beneficiary.id,
      fullName: beneficiary.fullName,
      phoneNumber: beneficiary.phoneNumber,
      createdAt: beneficiary.createdAt,
      updatedAt: beneficiary.updatedAt,
      deletedAt: beneficiary.deletedAt,
    };
  },
};

export default BeneficiaryMapper;
