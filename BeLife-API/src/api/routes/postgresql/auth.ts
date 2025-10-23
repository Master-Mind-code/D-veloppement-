/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import { Router, Request, Response, NextFunction } from 'express';
import { IVerifyOptions } from 'passport-local';
import { body, check, validationResult } from 'express-validator';

import { User } from '../../../database/interfaces/postgresql';
import {
  isAuthenticated,
  isUnAuthenticated,
} from '../../../../configs/passportLocal';
import Helper from '../../../../configs/helper';
import { getStatusCode, ReasonPhrases } from 'http-status-codes';
import logger from '../../../../logs/logger';

const AuthRouter = Router();

AuthRouter.post(
  '/login',
  isUnAuthenticated,
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    await check('email', 'Email is invalid').isEmail().run(req);
    await check('password', 'Password cannot be blank')
      .isLength({ min: 1 })
      .run(req);
    await body('email').normalizeEmail({ gmail_remove_dots: false }).run(req);

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return Helper.apiValidationErrorHandler(
        ReasonPhrases.BAD_REQUEST,
        getStatusCode(ReasonPhrases.BAD_REQUEST),
        "[Auth Routes '/login'] Errors where found in the submitted payload.",
        res,
        errors,
      );
    }

    passport.authenticate(
      'local',
      (err: Error, user: User, info: IVerifyOptions) => {
        if (err) {
          return Helper.operationalErrorHandler(
            ReasonPhrases.INTERNAL_SERVER_ERROR,
            getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
            "[Auth Routes '/login'] Error triggered during authentication process.",
            res,
            err,
          );
        }
        if (!user) {
          return Helper.apiResponseHandler(
            ReasonPhrases.UNAUTHORIZED,
            getStatusCode(ReasonPhrases.UNAUTHORIZED),
            false,
            info.message,
            res,
          );
        }
        req.logIn(user, async (err) => {
          if (err) {
            logger.error("[Auth Routes '/login'] Error at req.logIn()", err);

            return Helper.apiResponseHandler(
              ReasonPhrases.INTERNAL_SERVER_ERROR,
              getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
              false,
              'Unexpected error rised during authentication. Please wait and retry again.',
              res,
            );
          } else {
            return Helper.apiResponseHandler(
              ReasonPhrases.OK,
              getStatusCode(ReasonPhrases.OK),
              true,
              'Success! You are logged in.',
              res,
            );
          }
        });
      },
    )(req, res, next);
  },
);

AuthRouter.delete(
  '/logout',
  isAuthenticated,
  async (req: Request, res: Response): Promise<any> => {
    req.logOut((err) => {
      if (err) {
        logger.error("[Auth Routes '/logout'] Error at req.logIn()", err);

        return Helper.apiResponseHandler(
          ReasonPhrases.INTERNAL_SERVER_ERROR,
          getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
          false,
          'Unexpected error rised during logout. Please wait and retry again.',
          res,
        );
      }

      return Helper.apiResponseHandler(
        ReasonPhrases.OK,
        getStatusCode(ReasonPhrases.OK),
        true,
        'Success! You are logged out.',
        res,
      );
    });
  },
);

// TODO AuthRouter.put('/resetPassword', isAuthenticated, async (req: Request, res: Response): Promise<any> => {});
// https://blog.logrocket.com/implementing-secure-password-reset-node-js/
export default AuthRouter;
