/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { ReasonPhrases, getStatusCode } from 'http-status-codes';

import Helper from '../../../../configs/helper';
import logger from '../../../../logs/logger';

import PremiumFeeController from '../../controllers/postgresql/premiumfee';
import InsuranceController from '../../controllers/postgresql/insurance';

import {
  CreatePremiumFeeDTO,
  FilterPremiumFeeDTO,
} from '../../../database/dto/postgresql/premiumfee.dto';
import {
  hasAdminOrStaffRole,
  isAuthenticated,
} from '../../../../configs/passportLocal';
import { PremiumFeeFormula } from '../../../database/types';

const PremiumFeeRouter = Router();

PremiumFeeRouter.get(
  '/',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const filters: FilterPremiumFeeDTO = req.query;
      const results = await PremiumFeeController.getAll(filters);

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
      logger.error('[PremiumFee Routes GET / ] Unexpected error raised', error);

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

PremiumFeeRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('id', 'Insurance premium fee identifier is invalid')
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

      const result = await PremiumFeeController.getById(id);

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
    } catch (error) {
      logger.error(
        '[PremiumFee Routes GET /:id ] Unexpected error raised',
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

PremiumFeeRouter.post(
  '/',
  isAuthenticated,
  hasAdminOrStaffRole,
  async (req: Request, res: Response): Promise<any> => {
    try {
      // Validate Insurance information
      await check('insuranceId', 'Insurance identifier is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isUUID(4)
        .run(req);
      await check(
        'premiumFeeFormula',
        'Insurance premium formula should be valid',
      )
        .trim()
        .notEmpty()
        .isString()
        .isIn([PremiumFeeFormula.Family, PremiumFeeFormula.Individual])
        .run(req);
      await check(
        'premiumMonthlyFee',
        'Insurance premium monthly fee should be valid',
      )
        .trim()
        .notEmpty()
        .isNumeric()
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

      const payload: CreatePremiumFeeDTO = req.body;

      // Check if Insurance exist
      const insurance = await InsuranceController.getById(
        payload.insuranceId.toString(),
      );

      if (!insurance) {
        // add payload to error logs
        logger.error(
          "[PremiumFee Routes POST /] Insurance identifer doesn't not match DB information. ",
          payload,
        );

        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'Wrong insurance identifier! Please try again or contact the administrator.',
          res,
        );
      }

      const result = await PremiumFeeController.create(payload);

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
        '[PremiumFee Routes POST / ] Unexpected error raised',
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

export default PremiumFeeRouter;
