import {
  Commission,
  CommissionPopulated,
} from '../../../../database/interfaces/postgresql';
import {
  CommissionOutput,
  CommissionPopulatedOutput,
} from '../../../../database/models/postgresql/commission';

const CommissionMapper = {
  toCommission: (commission: CommissionOutput): Commission => {
    if (!commission) return commission as unknown as Commission;

    return {
      id: commission?.id,
      agentId: commission?.agentId,
      commissionRateId: commission?.commissionRateId,
      amount: commission?.amount,
      paymentReference: commission?.paymentReference,
      paymentType: commission?.paymentType,
      status: commission?.status,
      createdAt: commission?.createdAt,
      updatedAt: commission?.updatedAt,
      deletedAt: commission?.deletedAt,
    };
  },
};

export const CommissionPopulatedMapper = {
  toCommission: (
    commission: CommissionPopulatedOutput,
  ): CommissionPopulated => {
    if (!commission) return commission as unknown as CommissionPopulated;

    return {
      id: commission?.id,
      agent: {
        id: commission['agent.id'],
        teamId: commission['agent.teamId'],
        municipalityId: commission['agent.municipalityId'],
        fullName: commission['agent.fullName'],
        phoneNumber: commission['agent.phoneNumber'],
      },
      commissionRate: {
        id: commission['commissionRate.id'],
        type: commission['commissionRate.type'],
        rate: commission['commissionRate.are'],
      },
      amount: commission?.amount,
      paymentReference: commission?.paymentReference,
      paymentType: commission?.paymentType,
      status: commission?.status,
      createdAt: commission?.createdAt,
      updatedAt: commission?.updatedAt,
      deletedAt: commission?.deletedAt,
    };
  },
};

export default CommissionMapper;
