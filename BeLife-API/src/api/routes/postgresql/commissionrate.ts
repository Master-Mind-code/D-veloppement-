/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { ReasonPhrases, getStatusCode } from 'http-status-codes';

import Helper from '../../../../configs/helper';
import logger from '../../../../logs/logger';

import CommissionRateController from '../../controllers/postgresql/commissionrate';
import {
  CreateCommissionRateDTO,
  FilterCommissionRateDTO,
} from '../../../database/dto/postgresql/commissionrate.dto';
import {
  hasAdminOrStaffRole,
  isAuthenticated,
} from '../../../../configs/passportLocal';
import { CommissionPaymentType } from '../../../database/types';

const CommissionRateRouter = Router();

CommissionRateRouter.get(
  '/',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const filters: FilterCommissionRateDTO = req.query;
      const results = await CommissionRateController.getAll(filters);

      let message = '';

      if (results.length === 0) message = 'Not record found';

      return Helper.apiResponseHandler(
        ReasonPhrases.OK,
        getStatusCode(ReasonPhrases.OK),
        true,
        message,
        res,
        results,
      );
    } catch (error) {
      logger.error(
        '[Commission rates Routes GET / ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        error?.message,
        res,
      );
    }
  },
);

CommissionRateRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('id', 'Commission rate identifier is invalid')
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
          'Errors where found in submitted request body.',
          res,
          errors,
        );
      }

      const id = req.params.id.toString();

      const result = await CommissionRateController.getById(id);

      if (!result) {
        return Helper.apiResponseHandler(
          ReasonPhrases.NOT_FOUND,
          getStatusCode(ReasonPhrases.NOT_FOUND),
          false,
          'No record found',
          res,
          result,
        );
      } else {
        return Helper.apiResponseHandler(
          ReasonPhrases.OK,
          getStatusCode(ReasonPhrases.OK),
          true,
          '',
          res,
          result,
        );
      }
    } catch (error) {
      logger.error(
        '[Commission rates Routes GET /:id ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        error?.message,
        res,
      );
    }
  },
);

CommissionRateRouter.post(
  '/',
  isAuthenticated,
  hasAdminOrStaffRole,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('type', 'Commission rate type should be valid/not empty')
        .trim()
        .notEmpty()
        .isString()
        .isIn([
          CommissionPaymentType.MonthlyPremium,
          CommissionPaymentType.Subscription,
        ])
        .run(req);

      await check('rate', 'Commission rate should be valid/not empty')
        .trim()
        .notEmpty()
        .isDecimal()
        .run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return Helper.apiValidationErrorHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          'Errors where found in submitted request body.',
          res,
          errors,
        );
      }

      const payload: CreateCommissionRateDTO = req.body;

      payload.startDate = new Date();

      const result = await CommissionRateController.create(payload);

      let message: string;
      let reasonPhrase: ReasonPhrases;
      let responseStatus: boolean = false;

      if (!result) {
        message =
          'Unexpected error! Please try again or contact the administrator.';
        reasonPhrase = ReasonPhrases.BAD_REQUEST;
      } else {
        reasonPhrase = ReasonPhrases.CREATED;
        responseStatus = true;
      }

      return Helper.apiResponseHandler(
        reasonPhrase,
        getStatusCode(reasonPhrase),
        responseStatus,
        message,
        res,
        result,
      );
    } catch (error) {
      logger.error(
        '[Commission rates Routes POST / ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        error?.message,
        res,
      );
    }
  },
);

export default CommissionRateRouter;
