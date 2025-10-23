import { Router, Request, Response } from 'express';
import { getStatusCode, ReasonPhrases } from 'http-status-codes';
import { check, validationResult } from 'express-validator';

import {
  hasAdminOrStaffRole,
  isAuthenticated,
} from '../../../../configs/passportLocal';
import CustomerController from '../../controllers/postgresql/customer';
import {
  FilterCustomersDTO,
  UpdateCustomerDTO,
} from '../../../database/dto/postgresql/customer.dto';
import Helper from '../../../../configs/helper';

const CustomerRouter = Router();

CustomerRouter.get(
  '/',
  isAuthenticated,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (req: Request, res: Response): Promise<any> => {
    const filters: FilterCustomersDTO = req.query;
    const results = await CustomerController.getAll(filters);

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

CustomerRouter.get(
  '/:id',
  isAuthenticated,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (req: Request, res: Response): Promise<any> => {
    await check('id', 'Customer identifier is invalid')
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

    const result = await CustomerController.getById(id);

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

CustomerRouter.put(
  '/:id',
  isAuthenticated,
  hasAdminOrStaffRole,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id.toString();
    const payload: UpdateCustomerDTO = req.body;

    if (
      Helper.isEmpty(payload.birthDate) &&
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

    if (!Helper.isEmpty(payload.birthDate)) {
      await check('birthDate', 'Enter a valid birth date (e.9. dd/mm/yyyy)')
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 10, max: 10 })
        .run(req);
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

    await check('id', 'Customer identifier is invalid')
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
        '[Customers Routes PUT /:id] Errors where found in submitted request body.',
        res,
        errors,
      );
    }

    const result = await CustomerController.update(id, payload);

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

export default CustomerRouter;
