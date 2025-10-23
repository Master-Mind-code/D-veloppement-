import { Queue, ConnectionOptions, Job } from 'bullmq';
import { Job as BelifeJob } from './types';
import logger from '../../logs/logger';
import ContractController from '../api/controllers/postgresql/contract';
import Helper from '../../configs/helper';
import { ContractStatus } from '../database/dto/postgresql/contract.dto';
import PremiumFeeController from '../api/controllers/postgresql/premiumfee';

export const redisOptions: ConnectionOptions = {
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
};

const BelifeQueue = new Queue('belife_jobs', {
  connection: redisOptions,
  defaultJobOptions: { removeOnComplete: true, removeOnFail: 1000 },
});

const BelifeJobs = {
  addJob: async (job: BelifeJob) => {
    await BelifeQueue.add(job.name, job);
  },
  addCronJob: async (job: BelifeJob) => {
    await BelifeQueue.add(job.name, job, {
      repeat: {
        pattern: '0 0 * * *',
      },
    });
  },
  addBulkJob: async (job: BelifeJob[]) => {
    await BelifeQueue.addBulk(job);
  },
  updateContractStatus: async (job: Job) => {
    logger.info(`Here is our updateContractStatus job${JSON.stringify(job)}`);

    const contractId = (job.data.data.contractId as string) || null;

    if (contractId == null) {
      logger.error(
        'contractId seems to be null or undefined. Unable to perform job.',
      );
    }

    // Get the contract
    const contract = await ContractController.getById(contractId);

    if (!Helper.hasNonNullValue(contract, 'id')) {
      logger.error(
        `No customer's contract matches the given contract identifer "${contractId}". Unable to perform job.`,
      );
    } else {
      // Get the insurance premium fee information
      const premiumfee = await PremiumFeeController.getById(
        contract.subscription.premiumFee.id.toString(),
      );

      if (!Helper.hasNonNullValue(premiumfee, 'id')) {
        logger.error(
          `No insurance premium fee matches the identifier found in the given contract "${contractId}". Unable to perform job.`,
        );
      } else {
        // Check contract status
        const contractStatus = Helper.calculatePaymentStatus({
          subscriptionDate: new Date(contract.subscription.createdAt),
          premiumPlan: premiumfee.premiumMonthlyFee,
          totalPaidPremiums: contract.totalPayedPremiums,
        });

        // Log customer's contract status
        logger.info(
          `Customer's contract with identifier "${contractId}" present the following status ${JSON.stringify(contractStatus)}`,
        );

        if (
          contractStatus.isUpToDate &&
          contract.contractStatus === ContractStatus.Inactive
        ) {
          const updateContract = await ContractController.update(contractId, {
            contractStatus: ContractStatus.Active,
          });

          if (Helper.hasNonNullValue(updateContract, 'id')) {
            logger.info(
              `Customer's contract with identifier "${contractId}" was successfully update.`,
            );
          } else {
            logger.error(
              `Failure during status update of customer's contract with identifier "${contractId}".`,
            );
          }
        }
      }
    }
  },
  autoDebitPremiums: async (job: Job) => {
    logger.info(`Here is our autoDebitPremiums job${JSON.stringify(job)}`);

    // TODO Handle auto debit of premiums
    // Call autoDebitMtnAPI
    // If debit is success store premium data
    // else store debit failure that will be re-run on next month (1st of 5th)
  },
};

export default BelifeJobs;
