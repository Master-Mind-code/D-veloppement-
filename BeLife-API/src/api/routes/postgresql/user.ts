/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { body, check, validationResult } from 'express-validator';

import Helper from '../../../../configs/helper';
import UserController from '../../controllers/postgresql/user';
import {
  CreateUserDTO,
  UpdateUserDTO,
  FilterUserDTO,
  UserRole,
} from '../../../database/dto/postgresql/user.dto';
import {
  hasAdminRole,
  hasAdminOrDeveloperRole,
  isAuthenticated,
} from '../../../../configs/passportLocal';
import { getStatusCode, ReasonPhrases } from 'http-status-codes';

const UserRouter = Router();

UserRouter.get(
  '/',
  isAuthenticated,
  hasAdminOrDeveloperRole,
  async (req: Request, res: Response): Promise<any> => {
    const filters: FilterUserDTO = req.query;
    const results = await UserController.getAll(filters);

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

UserRouter.get(
  '/:id',
  isAuthenticated,
  hasAdminOrDeveloperRole,
  async (req: Request, res: Response): Promise<any> => {
    await check('id', 'User identifier is invalid')
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
        '[User Routes GET /:id] Errors where found in submitted request body.',
        res,
        errors,
      );
    }

    const id = req.params.id.toString();

    const result = await UserController.getById(id);

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

UserRouter.post(
  '/',
  isAuthenticated,
  hasAdminRole,
  async (req: Request, res: Response): Promise<any> => {
    await check('email', 'Email is invalid').isEmail().run(req);
    await check('password', 'Password cannot be blank')
      .isLength({ min: 1 })
      .run(req);
    await check('fullName', 'Full name cannot be blank')
      .isString()
      .isLength({ min: 1 })
      .run(req);
    await check('role', 'User role should be in defined role list')
      .isString()
      .isIn([UserRole.Admin, UserRole.Developer, UserRole.Staff])
      .run(req);
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return Helper.apiValidationErrorHandler(
        ReasonPhrases.BAD_REQUEST,
        getStatusCode(ReasonPhrases.BAD_REQUEST),
        '[User Routes POST /] Errors where found in submitted request body.',
        res,
        errors,
      );
    }

    const payload: CreateUserDTO = req.body;

    const result = await UserController.create(payload);

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

UserRouter.put(
  '/:id',
  isAuthenticated,
  hasAdminRole,
  async (req: Request, res: Response): Promise<any> => {
    const id = req.params.id.toString();
    const payload: UpdateUserDTO = req.body;

    if (
      Helper.isEmpty(payload.email) &&
      Helper.isEmpty(payload.fullName) &&
      Helper.isEmpty(payload.password) &&
      Helper.isEmpty(payload.role)
    ) {
      return res.status(500).json({
        status: false,
        message: 'For an update request payload cannot be empty.',
      });
    }

    if (!Helper.isEmpty(payload.email)) {
      await check('email', 'Email is invalid').isEmail().run(req);
      await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);
    }

    if (!Helper.isEmpty(payload.password)) {
      await check('password', 'Password cannot be blank')
        .isLength({ min: 1 })
        .run(req);
    }

    if (!Helper.isEmpty(payload.fullName)) {
      await check('fullName', 'Full name cannot be blank')
        .isString()
        .isLength({ min: 1 })
        .run(req);
    }

    if (!Helper.isEmpty(payload.role)) {
      await check('role', 'User role should be in defined role list')
        .isString()
        .isIn([UserRole.Admin, UserRole.Developer, UserRole.Staff])
        .run(req);
    }

    await check('id', 'User identifier is invalid')
      .trim()
      .notEmpty()
      .isString()
      .isUUID(4)
      .run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(500).json({
        status: false,
        message: 'Errors where found in the submitted payload.',
        errors: errors.array(),
      });
    }

    const result = await UserController.update(id, payload);

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

/**
 * Delete a user
 * @route DELETE /:id
 */
UserRouter.delete(
  '/:id',
  isAuthenticated,
  hasAdminRole,
  async (req: Request, res: Response): Promise<any> => {
    await check('id', 'User identifier is invalid')
      .trim()
      .notEmpty()
      .isString()
      .isUUID(4)
      .run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(500).json({
        status: false,
        message: 'Errors where found in the submitted payload.',
        errors: errors.array(),
      });
    }

    const id = req.params.id.toString();

    const result = await UserController.deleById(id);

    let message: string;
    let reasonPhrase: ReasonPhrases;

    if (!result) {
      message =
        'Unexpected error! Please try again or contact the administrator.';
      reasonPhrase = ReasonPhrases.BAD_REQUEST;
    } else {
      reasonPhrase = ReasonPhrases.OK;
    }

    return Helper.apiResponseHandler(
      reasonPhrase,
      getStatusCode(reasonPhrase),
      result,
      message,
      res,
    );
  },
);

export default UserRouter;
