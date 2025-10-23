/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { ReasonPhrases, getStatusCode } from 'http-status-codes';

import Helper from '../../../../configs/helper';

import { isAuthenticated } from '../../../../configs/passportLocal';

import SubscriptionController from '../../controllers/postgresql/subscription';

import { FilterSusbscriptionsDTO } from '../../../database/dto/postgresql/subscription.dto';

const SubscriptionRouter = Router();

SubscriptionRouter.get(
  '/',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    const filters: FilterSusbscriptionsDTO = req.query;
    const results = await SubscriptionController.getAll(filters);

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

SubscriptionRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    await check('id', 'Subscription identifier is invalid')
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
        '[Subscription Routes GET /:id] Errors where found in submitted request body.',
        res,
        errors,
      );
    }

    const id = req.params.id.toString();

    const result = await SubscriptionController.getById(id);

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

export default SubscriptionRouter;
