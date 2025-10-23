/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { ReasonPhrases, getStatusCode } from 'http-status-codes';

import Helper from '../../../../configs/helper';
import logger from '../../../../logs/logger';

import TeamController from '../../controllers/postgresql/team';
import {
  CreateTeamDTO,
  UpdateTeamDTO,
  FilterTeamDTO,
} from '../../../database/dto/postgresql/team.dto';
import {
  hasAdminOrStaffRole,
  isAuthenticated,
} from '../../../../configs/passportLocal';

const TeamRouter = Router();

TeamRouter.get(
  '/',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const filters: FilterTeamDTO = req.query;
      const results = await TeamController.getAll(filters);

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
      logger.error('[Team Routes GET / ] Unexpected error raised', error);

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

TeamRouter.get(
  '/:id',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('id', 'Team identifier is invalid')
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

      const result = await TeamController.getById(id);

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
      logger.error('[Team Routes GET /:id ] Unexpected error raised', error);

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

TeamRouter.post(
  '/',
  isAuthenticated,
  hasAdminOrStaffRole,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('teamName', 'Team name should be valid/not empty')
        .trim()
        .notEmpty()
        .isString()
        .run(req);

      await check('supervisorName', 'Supervisor name should be valid/not empty')
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

      const payload: CreateTeamDTO = req.body;

      const result = await TeamController.create(payload);

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
      logger.error('[Team Routes POST / ] Unexpected error raised', error);

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

TeamRouter.put(
  '/:id',
  isAuthenticated,
  hasAdminOrStaffRole,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const id = req.params.id.toString();
      const payload: UpdateTeamDTO = req.body;

      if (
        Helper.isEmpty(payload.supervisorName) &&
        Helper.isEmpty(payload.teamName)
      ) {
        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'For an update request payload cannot be empty.',
          res,
        );
      }

      if (!Helper.isEmpty(payload.teamName)) {
        await check('teamName', 'Team name should be valid/not empty')
          .trim()
          .notEmpty()
          .isString()
          .run(req);
      }

      if (!Helper.isEmpty(payload.supervisorName)) {
        await check(
          'supervisorName',
          'Supervisor name should be valid/not empty',
        )
          .trim()
          .notEmpty()
          .isString()
          .run(req);
      }

      await check('id', 'Team identifier is invalid')
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

      const result = await TeamController.update(id, payload);

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
      logger.error('[Team Routes PUT /:id ] Unexpected error raised', error);

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
