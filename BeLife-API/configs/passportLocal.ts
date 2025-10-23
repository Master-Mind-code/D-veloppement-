import passport from 'passport';
import passportLocal from 'passport-local';
import { Request, Response, NextFunction } from 'express';

import User, { UserInput } from '../src/database/models/postgresql/user';
import { User as UserInterface } from '../src/database/interfaces/postgresql';
import UserController from '../src/api/controllers/postgresql/user';
import { UserRole } from '../src/database/dto/postgresql/user.dto';
import Helper from './helper';
import { getStatusCode, ReasonPhrases } from 'http-status-codes';
import logger from '../logs/logger';

passport.use(
  new passportLocal.Strategy(
    {
      usernameField: 'email',
    },
    async (email: string, password: string, done) => {
      // The findOne method obtains the first entry it finds (that fulfills the optional query options, if provided).
      return await User.findOne({ where: { email: email } })
        .then(async (user) => {
          // Check if the user is there in the DB:
          if (!user) {
            return done(null, false, { message: `Email ${email} not found.` });
          }

          // If the user is correct, then let's see if he has entered the correct password.
          user.comparePassowrd(password, (err, isMatch) => {
            if (isMatch) {
              return done(null, {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
              });
            }
            return done(null, false, { message: 'Invalid email or password.' });
          });
        })
        .catch((err) => {
          return done(err);
        });
    },
  ),
);

// For Storing the user id in the session {req.session.passport.user = {id: '..'}}
passport.serializeUser((user: UserInterface, cb) => {
  process.nextTick(() => {
    cb(null, { id: user.id, email: user.email, fullName: user.fullName });
  });
});

// For checking if the user has an active session.
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

/**
 * Login Required middleware.
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    Helper.apiResponseHandler(
      ReasonPhrases.UNAUTHORIZED,
      getStatusCode(ReasonPhrases.UNAUTHORIZED),
      false,
      'You do not have access to this resource.',
      res,
    );
  }
};

/**
 * Login Required middleware.
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const isUnAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (req.isAuthenticated()) {
    Helper.apiResponseHandler(
      ReasonPhrases.BAD_REQUEST,
      getStatusCode(ReasonPhrases.BAD_REQUEST),
      false,
      'You are already logged in. Your session is still active.',
      res,
    );
  } else {
    return next();
  }
};

/**
 * Check if user has admin role
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const hasAdminRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id: Partial<UserInput> = req.user;

  const user = await UserController.getById(user_id.id.toString());

  if (user.role === UserRole.Admin) {
    return next();
  }

  Helper.apiResponseHandler(
    ReasonPhrases.UNAUTHORIZED,
    getStatusCode(ReasonPhrases.UNAUTHORIZED),
    false,
    'You do not have enough permission to access this resource.',
    res,
  );
};

/**
 * Check if user has admin or developer role
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const hasAdminOrDeveloperRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id: Partial<UserInput> = req.user;

  const user = await UserController.getById(user_id.id.toString());

  if (user.role === UserRole.Admin || user.role === UserRole.Developer) {
    return next();
  }

  Helper.apiResponseHandler(
    ReasonPhrases.UNAUTHORIZED,
    getStatusCode(ReasonPhrases.UNAUTHORIZED),
    false,
    'You do not have enough permission to access this resource.',
    res,
  );
};

/**
 * Check if user has admin nor staff role
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const hasAdminOrStaffRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const user_id: Partial<UserInput> = req.user;

  const user = await UserController.getById(user_id.id.toString());

  if (user.role === UserRole.Admin || user.role === UserRole.Staff) {
    return next();
  }

  Helper.apiResponseHandler(
    ReasonPhrases.UNAUTHORIZED,
    getStatusCode(ReasonPhrases.UNAUTHORIZED),
    false,
    'You do not have enough permission to access this resource.',
    res,
  );
};

/**
 * Check if USSD Api key is valid
 * @param req
 * @param res
 * @param next
 * @returns
 */
export const isApiKeyValid = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const api_key = req.header('x-api-key'); //Get API key from headers

  if (api_key === process.env.NODE_USSD_API_KEY) {
    return next();
  }

  logger.error(
    'Possible Unauthorized access was detected. Sent payload is as follow: ',
    req.body,
  );

  Helper.apiResponseHandler(
    ReasonPhrases.UNAUTHORIZED,
    getStatusCode(ReasonPhrases.UNAUTHORIZED),
    false,
    'You do not have access to this resource.',
    res,
  );
};

export default passport;
