import {
  Contract,
  ContractPopulated,
} from '../../../../database/interfaces/postgresql';
import {
  ContractOutput,
  ContractPopulatedOutput,
} from '../../../../database/models/postgresql/contract';
import PremiumFeeController from '../premiumfee';

const ContractMapper = {
  toContract: (contract: ContractOutput): Contract => {
    if (!contract) return contract as unknown as Contract;

    return {
      id: contract.id,
      customerId: contract.customerId,
      insuranceId: contract.insuranceId,
      subscriptionId: contract.subscriptionId,
      totalPayedPremiums: parseInt(contract.totalPayedPremiums.toString()),
      contractStatus: contract.contractStatus,
      contractNumber: contract.contractNumber,
      createdAt: contract?.createdAt,
      updatedAt: contract?.updatedAt,
      deletedAt: contract?.deletedAt,
    };
  },
};

export const ContractPopulateMapper = {
  toContract: async (
    contract: ContractPopulatedOutput,
  ): Promise<ContractPopulated> => {
    if (!contract) return contract as unknown as ContractPopulated;

    const premiumFee = await PremiumFeeController.getById(
      contract['subscription.premiumfee.id'],
    );

    return {
      id: contract.id,
      customer: {
        id: contract['customer.id'],
        fullName: contract['customer.fullName'],
        birthDate: contract['customer.birthDate'],
        phoneNumber: contract['customer.phoneNumber'],
      },
      insurance: {
        id: contract['insurance.id'],
        productName: contract['insurance.productName'],
        membershipAmount: contract['insurance.membershipAmount'],
      },
      subscription: {
        id: contract['subscription.id'],
        paymentReference: contract['subscription.paymentReference'],
        premiumFee: {
          id: contract['subscription.premiumfee.id'],
          premiumFeeFormula: premiumFee?.premiumFeeFormula,
          premiumMonthlyFee: premiumFee?.premiumMonthlyFee,
        },
        createdAt: contract['subscription.createdAt'],
      },
      totalPayedPremiums: parseInt(contract.totalPayedPremiums.toString()),
      contractStatus: contract.contractStatus,
      contractNumber: contract.contractNumber,
      createdAt: contract?.createdAt,
      updatedAt: contract?.updatedAt,
      deletedAt: contract?.deletedAt,
    };
  },
};

export default ContractMapper;
