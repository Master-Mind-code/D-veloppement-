import { Worker } from 'bullmq';
import BelifeJobs, { redisOptions } from './queue';
import { Job } from './types';
import logger from '../../logs/logger';

const jobHandlers = {
  updateContractStatus: BelifeJobs.updateContractStatus,
  autoDebitPremiums: BelifeJobs.autoDebitPremiums,
};

const processJob = async (job: Job) => {
  const handler = jobHandlers[job.name];

  if (handler) {
    logger.info(`Processing job: ${job.name}`);
    await handler(job);
  }
};

const BelifeWorkerInit = async () => {
  const worker = new Worker('belife_jobs', processJob, {
    connection: redisOptions,
    concurrency: 60,
  });

  worker.on('completed', (job) => {
    logger.info(`Job with identifier ${job.id} has completed!`);
  });

  worker.on('failed', (job, err) => {
    logger.error(
      `Job with identifier ${job.id} has failed with ${err.message}`,
    );
  });

  logger.info('Worker started!');
};

export default BelifeWorkerInit;
