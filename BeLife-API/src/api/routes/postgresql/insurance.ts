/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { ReasonPhrases, getStatusCode } from 'http-status-codes';

import Helper from '../../../../configs/helper';
import InsuranceController from '../../controllers/postgresql/insurance';
import {
  CreateInsuranceDTO,
  UpdateInsuranceDTO,
  FilterInsuranceDTO,
} from '../../../database/dto/postgresql/insurance.dto';
import {
  hasAdminOrStaffRole,
  isAuthenticated,
} from '../../../../configs/passportLocal';

const InsuranceRouter = Router();

InsuranceRouter.get(
  '/',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    const filters: FilterInsuranceDTO = req.query;
    const results = await InsuranceController.getAll(filters);

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

InsuranceRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    await check('id', 'Insurance identifier is invalid')
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
        '[Insurances Routes GET /:id] Errors where found in submitted request body.',
        res,
        errors,
      );
    }

    const id = req.params.id.toString();

    const result = await InsuranceController.getById(id);

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

InsuranceRouter.post(
  '/',
  isAuthenticated,
  hasAdminOrStaffRole,
  async (req: Request, res: Response): Promise<any> => {
    await check('productName', 'Product name should be valid.')
      .trim()
      .notEmpty()
      .isString()
      .run(req);
    await check('type', 'Product categorie/type should be valid')
      .trim()
      .notEmpty()
      .isString()
      .run(req);
    await check('description', 'Product description should be valid')
      .trim()
      .notEmpty()
      .isString()
      .run(req);
    await check(
      'membershipAmount',
      'Product membership amount should be numeric',
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
        '[Insurances Routes POST /] Errors where found in submitted request body.',
        res,
        errors,
      );
    }

    const payload: CreateInsuranceDTO = req.body;

    const result = await InsuranceController.create(payload);

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

InsuranceRouter.put(
  '/:id',
  isAuthenticated,
  hasAdminOrStaffRole,
  async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id.toString();
    const payload: UpdateInsuranceDTO = req.body;

    if (
      Helper.isEmpty(payload.description) &&
      Helper.isEmpty(payload.membershipAmount.toString()) &&
      Helper.isEmpty(payload.productName) &&
      Helper.isEmpty(payload.type)
    ) {
      return Helper.apiResponseHandler(
        ReasonPhrases.BAD_REQUEST,
        getStatusCode(ReasonPhrases.BAD_REQUEST),
        false,
        'For an update request payload cannot be empty.',
        res,
      );
    }

    if (!Helper.isEmpty(payload.description)) {
      await check('description', 'Product description should be valid')
        .trim()
        .notEmpty()
        .isString()
        .run(req);
    }

    if (!Helper.isEmpty(payload.membershipAmount.toString())) {
      await check(
        'membershipAmount',
        'Product membership amount should be numeric',
      )
        .trim()
        .notEmpty()
        .isNumeric()
        .run(req);
    }

    if (!Helper.isEmpty(payload.productName)) {
      await check('productName', 'Product name should be valid.')
        .trim()
        .notEmpty()
        .isString()
        .run(req);
    }

    if (!Helper.isEmpty(payload.type)) {
      await check('type', 'Product categorie/type should be valid')
        .trim()
        .notEmpty()
        .isString()
        .run(req);
    }

    await check('id', 'Insurance identifier is invalid')
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
        '[Insurances Routes PUT /:id] Errors where found in submitted request body.',
        res,
        errors,
      );
    }

    const result = await InsuranceController.update(id, payload);

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

export default InsuranceRouter;
