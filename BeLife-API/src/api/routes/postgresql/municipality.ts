/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { ReasonPhrases, getStatusCode } from 'http-status-codes';

import Helper from '../../../../configs/helper';
import logger from '../../../../logs/logger';

import MunicipalityController from '../../controllers/postgresql/municipality';
import {
  CreateMunicipalityDTO,
  UpdateMunicipalityDTO,
  FilterMunicipalityDTO,
} from '../../../database/dto/postgresql/municipality.dto';
import {
  hasAdminOrStaffRole,
  isAuthenticated,
} from '../../../../configs/passportLocal';

const MunicipalityRouter = Router();

MunicipalityRouter.get(
  '/',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const filters: FilterMunicipalityDTO = req.query;
      const results = await MunicipalityController.getAll(filters);

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
        '[Municipality Routes GET / ] Unexpected error raised',
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

MunicipalityRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('id', 'Municipality identifier is invalid')
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
          '[Municipality Routes GET /:id] Errors where found in submitted request body.',
          res,
          errors,
        );
      }

      const id = req.params.id.toString();

      const result = await MunicipalityController.getById(id);

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
        '[Municipality Routes GET /:id ] Unexpected error raised',
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

MunicipalityRouter.post(
  '/',
  isAuthenticated,
  hasAdminOrStaffRole,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('name', 'Municipality name should be valid/not empty')
        .trim()
        .notEmpty()
        .isString()
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

      const payload: CreateMunicipalityDTO = req.body;

      const result = await MunicipalityController.create(payload);

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
        '[Municipality Routes POST / ] Unexpected error raised',
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

MunicipalityRouter.put(
  '/:id',
  isAuthenticated,
  hasAdminOrStaffRole,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id.toString();
      const payload: UpdateMunicipalityDTO = req.body;

      if (Helper.isEmpty(payload.name)) {
        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'For an update request payload cannot be empty.',
          res,
        );
      }

      if (!Helper.isEmpty(payload.name)) {
        await check('name', 'Municipality name should be valid/not empty')
          .trim()
          .notEmpty()
          .isString()
          .run(req);
      }

      await check('id', 'Municipality identifier is invalid')
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

      const result = await MunicipalityController.update(id, payload);

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
        '[Municipality Routes PUT /:id ] Unexpected error raised',
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

export default MunicipalityRouter;
