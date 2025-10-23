/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { ReasonPhrases, getStatusCode } from 'http-status-codes';

import Helper from '../../../../configs/helper';
import BeneficiaryController from '../../controllers/postgresql/beneficiary';
import {
  UpdateBeneficiaryDTO,
  FilterBeneficairysDTO,
} from '../../../database/dto/postgresql/beneficiary.dto';
import {
  hasAdminOrStaffRole,
  isAuthenticated,
} from '../../../../configs/passportLocal';

const BeneficiaryRouter = Router();

BeneficiaryRouter.get(
  '/',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    const filters: FilterBeneficairysDTO = req.query;
    const results = await BeneficiaryController.getAll(filters);

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

BeneficiaryRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    await check('id', 'Beneficiary identifier is invalid')
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
        '[Beneficiary Routes GET /:id] Errors where found in submitted request body.',
        res,
        errors,
      );
    }

    const id = req.params.id.toString();

    const result = await BeneficiaryController.getById(id);

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

BeneficiaryRouter.put(
  '/:id',
  isAuthenticated,
  hasAdminOrStaffRole,
  async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id.toString();
    const payload: UpdateBeneficiaryDTO = req.body;

    if (
      Helper.isEmpty(payload.fullName) &&
      Helper.isEmpty(payload.phoneNumber)
    ) {
      return Helper.apiResponseHandler(
        ReasonPhrases.BAD_REQUEST,
        getStatusCode(ReasonPhrases.BAD_REQUEST),
        false,
        'For an update request payload cannot be empty.',
        res,
      );
    }

    if (!Helper.isEmpty(payload.fullName)) {
      await check('fullName', 'Enter a valid Name')
        .trim()
        .notEmpty()
        .isString()
        .run(req);
    }

    if (!Helper.isEmpty(payload.phoneNumber)) {
      await check('phoneNumber', 'Enter a valid phone number')
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 10, max: 14 })
        .run(req);
    }

    await check('id', 'Beneficiary identifier is invalid')
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
        '[Beneficiary Routes PUT /:id] Errors where found in submitted request body.',
        res,
        errors,
      );
    }

    const result = await BeneficiaryController.update(id, payload);

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
  },
);

export default BeneficiaryRouter;
