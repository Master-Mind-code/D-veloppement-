import { CommissionRate } from '../../../../database/interfaces/postgresql';
import { CommissionRateOuptut } from '../../../../database/models/postgresql/comissionrate';

const CommissionRateMapper = {
  toCommissionRate: (commissionrate: CommissionRateOuptut): CommissionRate => {
    if (!commissionrate) return commissionrate as unknown as CommissionRate;

    return {
      id: commissionrate.id,
      type: commissionrate.type,
      rate: commissionrate.rate,
      startDate: commissionrate.startDate,
      endDate: commissionrate.endDate,
      createdAt: commissionrate.createdAt,
      updatedAt: commissionrate.updatedAt,
      deletedAt: commissionrate.deletedAt,
    };
  },
};

export default CommissionRateMapper;
