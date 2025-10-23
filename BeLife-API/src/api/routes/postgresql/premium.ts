/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { ReasonPhrases, getStatusCode } from 'http-status-codes';
import { CronJob } from 'cron';

import Helper from '../../../../configs/helper';

import { isAuthenticated } from '../../../../configs/passportLocal';

import PremiumController from '../../controllers/postgresql/premium';

import { FilterPremiumsDTO } from '../../../database/dto/postgresql/premium.dto';
import logger from '../../../../logs/logger';
import SubscriptionController from '../../controllers/postgresql/subscription';
import { PaymentMode, PaymentStatus } from '../../../database/types';
import { Job as BelifeJob } from '../../../jobs/types';
import BelifeJobs from '../../../jobs/queue';

const PremiumRouter = Router();

CronJob.from({
  cronTime: '0 0 0 27 * *',
  onTick: async () => {
    const today = new Date();
    logger.info(
      `End of month debit has started on ${today.toLocaleDateString()}`,
    );

    // Fetch all the subscriptions with paymentMode equal to PaymentMode.Auto and add bullmq bulk jobs
    const autoDebitPremiums =
      await SubscriptionController.getAllPaidAndAutoDebit({
        isDeleted: false,
        includeDeleted: false,
        paymentMode: PaymentMode.Auto,
        paymentStatus: PaymentStatus.Successful,
      });

    if (autoDebitPremiums.length > 0) {
      const belifeJobs: BelifeJob[] = autoDebitPremiums.map((subscription) => ({
        name: 'autoDebitPremiums',
        data: {
          phoneNumber: subscription.customer.phoneNumber,
          subscriptionId: subscription.id,
          premiumPlan: subscription.premiumFee.premiumMonthlyFee,
        },
      }));

      BelifeJobs.addBulkJob(belifeJobs);
    } else {
      logger.info(
        'No subscription with auto debit mode were found. Skipping the auto debit run.',
      );
    }
  },
  start: true,
});

CronJob.from({
  cronTime: '0 0 0 1,5 * *',
  onTick: function () {
    const today = new Date();
    logger.info(
      `The end of month debit failure checker/retry ${today.toLocaleDateString()}`,
    );

    // TODO: Fetch all the debits that failed on 27th of the previous month and retry them.
  },
  start: true,
});

PremiumRouter.get(
  '/',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    const filters: FilterPremiumsDTO = req.query;
    const results = await PremiumController.getAll(filters);

    let message = '';

    if (results.length === 0) message = 'Not found';

    return Helper.apiResponseHandler(
      ReasonPhrases.OK,
      getStatusCode(ReasonPhrases.OK),
      true,
      message,
      res,
      results,
    );
  },
);

PremiumRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    await check('id', 'Premium identifier is invalid')
      .trim()
      .notEmpty()
      .isString()
      .isUUID(4)
      .run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return Helper.apiValidationErrorHandler(
        ReasonPhrases.BAD_REQUEST,
        getStatusCode(ReasonPhrases.BAD_REQUEST),
        '[Premium Routes GET /:id] Errors where found in submitted request body.',
        res,
        errors,
      );
    }

    const id = req.params.id.toString();

    const result = await PremiumController.getById(id);

    let message = '';

    if (!result) message = 'Not found';

    return Helper.apiResponseHandler(
      ReasonPhrases.OK,
      getStatusCode(ReasonPhrases.OK),
      true,
      message,
      res,
      result,
    );
  },
);

export default PremiumRouter;
