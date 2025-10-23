/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { ReasonPhrases, getStatusCode } from 'http-status-codes';

import Helper from '../../../../configs/helper';
import logger from '../../../../logs/logger';

import AgentController from '../../controllers/postgresql/agent';
import {
  CreateAgentDTO,
  UpdateAgentDTO,
  FilterAgentDTO,
} from '../../../database/dto/postgresql/agent.dto';
import {
  hasAdminOrStaffRole,
  isAuthenticated,
} from '../../../../configs/passportLocal';

const AgentRouter = Router();

AgentRouter.get(
  '/',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const filters: FilterAgentDTO = req.query;
      const results = await AgentController.getAll(filters);

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
      logger.error('[Agent Routes GET / ] Unexpected error raised', error);

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

AgentRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('id', 'Agent identifier is invalid')
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

      const result = await AgentController.getById(id);

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
      logger.error('[Agent Routes GET /:id ] Unexpected error raised', error);

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

AgentRouter.post(
  '/',
  isAuthenticated,
  hasAdminOrStaffRole,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('municipalityId', 'Municipality identifier is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isUUID(4)
        .run(req);

      await check('teamId', 'Team identifier is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isUUID(4)
        .run(req);

      await check('fullName', 'Agent full name should be valid/not empty')
        .trim()
        .notEmpty()
        .isString()
        .run(req);

      await check('phoneNumber', 'Agent phone number should be valid/not empty')
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 10, max: 14 })
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

      const payload: CreateAgentDTO = req.body;

      const result = await AgentController.create(payload);

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
      logger.error('[Agent Routes POST / ] Unexpected error raised', error);

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

AgentRouter.put(
  '/:id',
  isAuthenticated,
  hasAdminOrStaffRole,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id.toString();
      const payload: UpdateAgentDTO = req.body;

      if (
        Helper.isEmpty(payload.fullName) &&
        Helper.isEmpty(payload.teamId.toString()) &&
        Helper.isEmpty(payload.municipalityId.toString())
      ) {
        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'For an update request payload cannot be empty.',
          res,
        );
      }

      if (!Helper.isEmpty(payload.teamId.toString())) {
        await check('teamId', 'Team identifier is invalid')
          .trim()
          .notEmpty()
          .isString()
          .isUUID(4)
          .run(req);
      }

      if (!Helper.isEmpty(payload.municipalityId.toString())) {
        await check('municipalityId', 'Municipality identifier is invalid')
          .trim()
          .notEmpty()
          .isString()
          .isUUID(4)
          .run(req);
      }

      if (!Helper.isEmpty(payload.fullName)) {
        await check('fullName', 'Agent full name should be valid/not empty')
          .trim()
          .notEmpty()
          .isString()
          .run(req);
      }

      await check('id', 'Agent identifier is invalid')
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

      const result = await AgentController.update(id, payload);

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
      logger.error('[Agent Routes PUT /:id ] Unexpected error raised', error);

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
