/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router, Request, Response } from 'express';
import { check, validationResult } from 'express-validator';
import { ReasonPhrases, getStatusCode } from 'http-status-codes';

import logger from '../../../../logs/logger';
import Helper from '../../../../configs/helper';

import BelifeJobs from '../../../jobs/queue';

import { isApiKeyValid } from '../../../../configs/passportLocal';

import {
  PaymentStatus,
  PaymentMode,
  CommissionPaymentType,
  CommissionStatus,
} from '../../../database/types';

import { Beneficiary, Customer } from '../../../database/interfaces/postgresql';

import {
  CreateSubscriptionDTO,
  UpdateSubscriptionDTO,
  UssdPayloadForCreatingSubscription,
  UssdPayloadForUpdatingSubscription,
} from '../../../database/dto/postgresql/subscription.dto';
import { FilterInsuranceDTO } from '../../../database/dto/postgresql/insurance.dto';
import {
  CreatePremiumDTO,
  UpdatePremiumDTO,
  UssdPayloadForCreatingPremium,
  UssdPaylodForUpdatingPremium,
} from '../../../database/dto/postgresql/premium.dto';
import { CreateContractDTO } from '../../../database/dto/postgresql/contract.dto';
import { CreateCommissionDTO } from '../../../database/dto/postgresql/commission.dto';

import BeneficiaryController from '../../controllers/postgresql/beneficiary';
import CustomerController from '../../controllers/postgresql/customer';
import InsuranceController from '../../controllers/postgresql/insurance';
import SubscriptionController from '../../controllers/postgresql/subscription';
import PremiumController from '../../controllers/postgresql/premium';
import ContractController from '../../controllers/postgresql/contract';
import PremiumFeeController from '../../controllers/postgresql/premiumfee';
import AgentController from '../../controllers/postgresql/agent';
import CommissionRateController from '../../controllers/postgresql/commissionrate';
import CommissionController from '../../controllers/postgresql/commission';

const UssdRouter = Router();
/**
 * // TODO: Define here unguarded routes for ussd only calls
 * - One route for subscription that create customer, beneficiary, verify the insurance existence and add the subscription 🟢
 * - One route to get all insurances 🟢
 * - One route to check if user have a valid subscription 🟢 but need to be redone with implementation of contracts 🟢
 * - One route to check to payments of customer
 */

/**
 * Get a suscription by customer phone number
 * @route GET /customers/:phoneNumber
 */
UssdRouter.get(
  '/customers/:phoneNumber',
  isApiKeyValid,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('phoneNumber', 'Customer phone number is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 10, max: 14 })
        .run(req);

      // Handle errors if any
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

      const phoneNumber = req.params.phoneNumber.toString();

      // Get the customer info
      const customer = await CustomerController.getByParams(
        'phoneNumber',
        phoneNumber,
      );

      if (!customer) {
        // add payload to error logs
        logger.error(
          '[Ussd Routes GET /customers/:phoneNumber] The given phone number does not match any customer.',
          phoneNumber,
        );

        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'The given phone number does not match any customer.! Please try again or contact your insurance provider.',
          res,
        );
      }

      // Get the customer's subscription
      const result = await SubscriptionController.getAllByParams(
        'customerId',
        customer.id.toString(),
      );

      let message: string;
      let reasonPhrase: ReasonPhrases;
      let responseStatus: boolean = false;

      if (result.length == 0) {
        message = `No match found for the given phone number ${phoneNumber}`;
        reasonPhrase = ReasonPhrases.NOT_FOUND;
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
        '[USSD Routes GET /subscriptions/:phoneNumber ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        'Sorry an unexpected error was raised. Please try again later or contact the website administrator.',
        res,
      );
    }
  },
);

/**
 * Check if agent exist
 * @route GET /agents/:phoneNumber
 */
UssdRouter.get(
  '/agents/:phoneNumber',
  isApiKeyValid,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('phoneNumber', 'Agent phone number is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 10, max: 14 })
        .run(req);

      // Handle errors if any
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

      const phoneNumber = req.params.phoneNumber.toString();

      // Get the agent info
      const agent = await AgentController.getByParams(
        'phoneNumber',
        phoneNumber,
      );

      if (!agent) {
        // add payload to error logs
        logger.error(
          '[Ussd Routes GET /agents/:phoneNumber] The given phone number does not match any agent.',
          phoneNumber,
        );

        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'The given phone number does not match any agent.! Please try again or contact Prudential Belife.',
          res,
        );
      }
    } catch (error) {
      logger.error(
        '[USSD Routes GET /agents/:phoneNumber ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        'Sorry an unexpected error was raised. Please try again later or contact the website administrator.',
        res,
      );
    }
  },
);

/**
 * Create a new subscription entry
 * @route POST /subscriptions
 */
UssdRouter.post(
  '/subscriptions',
  isApiKeyValid,
  async (req: Request, res: Response): Promise<any> => {
    try {
      // Validate customer information
      await check('customer.fullName', 'Customer name is invalid')
        .trim()
        .notEmpty()
        .isString()
        .run(req);
      await check('customer.phoneNumber', 'Customer phone number is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 10, max: 14 })
        .run(req);
      await check(
        'customer.birthDate',
        'Enter a valid birth date (e.g. dd/mm/yyyy or ddmmyyyy)',
      )
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 8, max: 10 })
        .run(req);

      // Validate beneficiary information
      await check('beneficiary.fullName', 'Beneficiary name is invalid')
        .trim()
        .notEmpty()
        .isString()
        .run(req);
      await check(
        'beneficiary.phoneNumber',
        'Beneficiary phone number is invalid',
      )
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 10, max: 14 })
        .run(req);

      // Validate Insurance information
      await check('insuranceId', 'Insurance identifier is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isUUID(4)
        .run(req);

      // Validate Insurance premium fee information
      await check('premiumFeeId', 'Insurance premium fee identifier is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isUUID(4)
        .run(req);

      // Validate Subscription information
      await check('paymentMode', 'Payment mode is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isIn([PaymentMode.Auto, PaymentMode.Manual])
        .run(req);

      await check('paymentReference', 'Payment reference is invalid')
        .trim()
        .notEmpty()
        .isString()
        .run(req);

      // Handle errors if any
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

      const payload: UssdPayloadForCreatingSubscription = req.body;

      // Check if Insurance exist
      const insurance = await InsuranceController.getById(
        payload.insuranceId.toString(),
      );

      if (!Helper.hasNonNullValue(insurance, 'id')) {
        // add payload to error logs
        logger.error(
          "[USSD Routes POST /subscriptions] Insurance identifer doesn't not match DB information. ",
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

      // Check if Insurance premium fee exists
      const premiumfee = await PremiumFeeController.getById(
        payload.premiumFeeId.toString(),
      );

      if (!Helper.hasNonNullValue(premiumfee, 'id')) {
        // add payload to error logs
        logger.error(
          "[USSD Routes POST /subscriptions] Insurance premium fee identifer doesn't not match DB information. ",
          payload,
        );

        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'Wrong insurance premium fee identifier! Please try again or contact the administrator.',
          res,
        );
      }

      // Check if the customer already exists
      const ifExistCustomer = await CustomerController.getByParams(
        'phoneNumber',
        payload.customer.phoneNumber,
      );

      let customer: Customer;

      if (Helper.hasNonNullValue(ifExistCustomer, 'id')) {
        customer = ifExistCustomer;
      } else {
        // Perform customer entry
        customer = await CustomerController.create(payload.customer);

        if (!Helper.hasNonNullValue(customer, 'id')) {
          // add payload to error logs
          logger.error(
            "[USSD Routes POST /subscriptions] Customer Entry couldn't be performed. ",
            payload,
          );

          return Helper.apiResponseHandler(
            ReasonPhrases.BAD_REQUEST,
            getStatusCode(ReasonPhrases.BAD_REQUEST),
            false,
            'Unexpected error while adding customer entry! Please try again or contact the administrator.',
            res,
          );
        }
      }

      // Check if the beneficiary already exists
      const ifExistBeneficiary = await BeneficiaryController.getByParams(
        'phoneNumber',
        payload.beneficiary.phoneNumber,
      );

      let beneficiary: Beneficiary;

      if (Helper.hasNonNullValue(ifExistBeneficiary, 'id')) {
        beneficiary = ifExistBeneficiary;
      } else {
        // Perform beneficiary entry
        beneficiary = await BeneficiaryController.create(payload.beneficiary);

        if (!Helper.hasNonNullValue(beneficiary, 'id')) {
          // add payload to error logs
          logger.error(
            "[USSD Routes POST /USSD] Beneficiary Entry couldn't be performed. ",
            payload,
          );

          return Helper.apiResponseHandler(
            ReasonPhrases.BAD_REQUEST,
            getStatusCode(ReasonPhrases.BAD_REQUEST),
            false,
            'Unexpected error while adding beneficiary entry! Please try again or contact the administrator.',
            res,
          );
        }
      }

      // Perform subscription entry
      const subscriptionPayload: CreateSubscriptionDTO = {
        customerId: customer.id,
        beneficiaryId: beneficiary.id,
        insuranceId: insurance.id,
        premiumFeeId: premiumfee.id,
        paymentMode: payload.paymentMode,
        paymentReference: payload.paymentReference,
      };

      // Check if subscrption exist
      const ifExitSubscription = await SubscriptionController.getAllByParams(
        'customerId',
        customer.id.toString(),
      );

      const subscripitionValidation = Helper.validateSubscription(
        ifExitSubscription,
        payload,
      );

      if (!subscripitionValidation.isValid) {
        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          subscripitionValidation.message,
          res,
        );
      }

      const result = await SubscriptionController.create(subscriptionPayload);

      let message: string;
      let reasonPhrase: ReasonPhrases;
      let responseStatus: boolean = false;

      if (!Helper.hasNonNullValue(result, 'id')) {
        message =
          'Unexpected error while adding subscription entry! Please try again or contact the administrator.';
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
        '[USSD Routes POST /subscriptions ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        `Sorry, error found during validation of souscription with reference ${req.body.paymentReference}.`,
        res,
      );
    }
  },
);

/**
 * Create a new subscription entry
 * @route POST /agentSubscriptions
 */
UssdRouter.post(
  '/agentSubscriptions',
  isApiKeyValid,
  async (req: Request, res: Response): Promise<any> => {
    try {
      // Validate customer information
      await check('customer.fullName', 'Customer name is invalid')
        .trim()
        .notEmpty()
        .isString()
        .run(req);
      await check('customer.phoneNumber', 'Customer phone number is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 10, max: 14 })
        .run(req);
      await check(
        'customer.birthDate',
        'Enter a valid birth date (e.g. dd/mm/yyyy)',
      )
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 10, max: 10 })
        .run(req);

      // Validate beneficiary information
      await check('beneficiary.fullName', 'Beneficiary name is invalid')
        .trim()
        .notEmpty()
        .isString()
        .run(req);
      await check(
        'beneficiary.phoneNumber',
        'Beneficiary phone number is invalid',
      )
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 10, max: 14 })
        .run(req);

      // Validate Insurance information
      await check('insuranceId', 'Insurance identifier is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isUUID(4)
        .run(req);

      // Validate Insurance premium fee information
      await check('premiumFeeId', 'Insurance premium fee identifier is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isUUID(4)
        .run(req);

      // Validate Subscription information
      await check('paymentMode', 'Payment mode is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isIn([PaymentMode.Auto, PaymentMode.Manual])
        .run(req);

      // Validate Agent information
      await check('agentId', 'Agent identifier is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isUUID(4)
        .run(req);

      await check('paymentReference', 'Payment reference is invalid')
        .trim()
        .notEmpty()
        .isString()
        .run(req);

      // Handle errors if any
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

      const payload: UssdPayloadForCreatingSubscription = req.body;

      // Check if Agent exist
      const agent = await AgentController.getById(req.body.agentId.toString());

      if (!Helper.hasNonNullValue(agent, 'id')) {
        // add payload to error logs
        logger.error(
          "[USSD Routes POST /agentSubscriptions] Agent identifer doesn't not match DB information. ",
          payload,
        );

        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'Wrong agent identifier! Please try again or contact the administrator.',
          res,
        );
      }

      // Check if Insurance exist
      const insurance = await InsuranceController.getById(
        payload.insuranceId.toString(),
      );

      if (!Helper.hasNonNullValue(insurance, 'id')) {
        // add payload to error logs
        logger.error(
          "[USSD Routes POST /agentSubscriptions] Insurance identifer doesn't not match DB information. ",
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

      // Check if Insurance premium fee exists
      const premiumfee = await PremiumFeeController.getById(
        payload.premiumFeeId.toString(),
      );

      if (!Helper.hasNonNullValue(premiumfee, 'id')) {
        // add payload to error logs
        logger.error(
          "[USSD Routes POST /agentSubscriptions] Insurance premium fee identifer doesn't not match DB information. ",
          payload,
        );

        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'Wrong insurance premium fee identifier! Please try again or contact the administrator.',
          res,
        );
      }

      // Check if the customer already exists
      const ifExistCustomer = await CustomerController.getByParams(
        'phoneNumber',
        payload.customer.phoneNumber,
      );

      let customer: Customer;

      if (Helper.hasNonNullValue(ifExistCustomer, 'id')) {
        customer = ifExistCustomer;
      } else {
        // Perform customer entry
        customer = await CustomerController.create(payload.customer);

        if (!Helper.hasNonNullValue(customer, 'id')) {
          // add payload to error logs
          logger.error(
            "[USSD Routes POST /agentSubscriptions] Customer Entry couldn't be performed. ",
            payload,
          );

          return Helper.apiResponseHandler(
            ReasonPhrases.BAD_REQUEST,
            getStatusCode(ReasonPhrases.BAD_REQUEST),
            false,
            'Unexpected error while adding customer entry! Please try again or contact the administrator.',
            res,
          );
        }
      }

      // Check if the beneficiary already exists
      const ifExistBeneficiary = await BeneficiaryController.getByParams(
        'phoneNumber',
        payload.beneficiary.phoneNumber,
      );

      let beneficiary: Beneficiary;

      if (Helper.hasNonNullValue(ifExistBeneficiary, 'id')) {
        beneficiary = ifExistBeneficiary;
      } else {
        // Perform beneficiary entry
        beneficiary = await BeneficiaryController.create(payload.beneficiary);

        if (!Helper.hasNonNullValue(beneficiary, 'id')) {
          // add payload to error logs
          logger.error(
            "[USSD Routes POST /agentSubscriptions] Beneficiary Entry couldn't be performed. ",
            payload,
          );

          return Helper.apiResponseHandler(
            ReasonPhrases.BAD_REQUEST,
            getStatusCode(ReasonPhrases.BAD_REQUEST),
            false,
            'Unexpected error while adding beneficiary entry! Please try again or contact the administrator.',
            res,
          );
        }
      }

      // Perform subscription entry
      const subscriptionPayload: CreateSubscriptionDTO = {
        customerId: customer.id,
        beneficiaryId: beneficiary.id,
        insuranceId: insurance.id,
        premiumFeeId: premiumfee.id,
        paymentMode: payload.paymentMode,
        paymentReference: payload.paymentReference,
      };

      // Check if subscrption exist
      const ifExitSubscription = await SubscriptionController.getAllByParams(
        'customerId',
        customer.id.toString(),
      );

      const subscripitionValidation = Helper.validateSubscription(
        ifExitSubscription,
        payload,
      );

      if (!subscripitionValidation.isValid) {
        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          subscripitionValidation.message,
          res,
        );
      }

      const result = await SubscriptionController.create(subscriptionPayload);

      let message: string;
      let reasonPhrase: ReasonPhrases;
      let responseStatus: boolean = false;

      if (!Helper.hasNonNullValue(result, 'id')) {
        message =
          'Unexpected error while adding subscription entry! Please try again or contact the administrator.';
        reasonPhrase = ReasonPhrases.BAD_REQUEST;
      } else {
        reasonPhrase = ReasonPhrases.CREATED;
        responseStatus = true;

        // TODO: Get current agent commission rate
        const commissirate = await CommissionRateController.getByParams(
          'endDate',
          'null',
        );

        // TODO: Add agent commission
        const commissionPayload: CreateCommissionDTO = {
          agentId: agent.id,
          commissionRateId: commissirate.id,
          amount: premiumfee.premiumMonthlyFee,
          paymentReference: payload.paymentReference,
          paymentType: CommissionPaymentType.Subscription,
          status: CommissionStatus.Init,
        };

        await CommissionController.create(commissionPayload);
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
        '[USSD Routes POST /agentSubscriptions ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        `Sorry, error found during validation of souscription with reference ${req.body.paymentReference}.`,
        res,
      );
    }
  },
);

/**
 * Update a subscription's paymentStatus or paymentMode
 * @route PUT /subscriptions
 */
UssdRouter.put(
  '/subscriptions',
  isApiKeyValid,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const payload: UssdPayloadForUpdatingSubscription = req.body;

      if (
        Helper.isEmpty(payload.paymentReference) ||
        (Helper.isEmpty(payload.paymentStatus) &&
          Helper.isEmpty(payload.paymentReference) &&
          Helper.isEmpty(payload.paymentMode))
      ) {
        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'For an update request payload cannot be empty. Only the payment status and payment mode could be updated.',
          res,
        );
      }

      await check('paymentReference', 'Payment reference should not be empty')
        .trim()
        .notEmpty()
        .isString()
        .run(req);

      if (!Helper.isEmpty(payload.paymentStatus)) {
        await check('paymentStatus', 'Payment status is invalid')
          .trim()
          .notEmpty()
          .isString()
          .isIn([PaymentStatus.Failed, PaymentStatus.Successful])
          .run(req);
      }

      if (!Helper.isEmpty(payload.paymentMode)) {
        await check('paymentMode', 'Payment mode is invalid')
          .trim()
          .notEmpty()
          .isString()
          .isIn([PaymentMode.Auto, PaymentMode.Manual])
          .run(req);
      }

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

      // Get subscription by param
      const subscription = await SubscriptionController.getByParams(
        'paymentReference',
        payload.paymentReference,
      );

      if (!Helper.hasNonNullValue(subscription, 'id')) {
        // add payload to error logs
        logger.error(
          '[USSD Routes PUT /subscriptions] No record matches the given subscription reference. ',
          payload,
        );

        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'No record matches the given subscription reference. Please try again or contact the administrator.',
          res,
        );
      }

      if (
        subscription.paymentStatus != PaymentStatus.Pending &&
        Helper.isEmpty(payload.paymentMode)
      ) {
        return Helper.apiResponseHandler(
          ReasonPhrases.NOT_FOUND,
          getStatusCode(ReasonPhrases.NOT_FOUND),
          false,
          'The status of the subscription was already updated. Thank you for your understanding.',
          res,
        );
      }

      // Initialize update paylod
      const updatePayload: UpdateSubscriptionDTO = {} as UpdateSubscriptionDTO;

      if (
        subscription.paymentStatus === PaymentStatus.Pending &&
        !Helper.isEmpty(payload.paymentStatus)
      ) {
        updatePayload.paymentStatus = payload.paymentStatus;
      }

      if (
        !Helper.isEmpty(payload.paymentMode) &&
        subscription.paymentMode !== payload.paymentMode
      ) {
        updatePayload.paymentMode = payload.paymentMode;
      }

      const result = await SubscriptionController.update(
        subscription.id.toString(),
        updatePayload,
      );

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

        // Store customer contrat only on payment status successfull update
        if (payload.paymentStatus === PaymentStatus.Successful) {
          const contractInput: CreateContractDTO = {
            customerId: result.customerId,
            insuranceId: result.insuranceId,
            subscriptionId: result.id,
            contractNumber: subscription.customer.phoneNumber,
          };

          const contract = await ContractController.create(contractInput);

          if (Helper.hasNonNullValue(contract, 'id')) {
            await BelifeJobs.addCronJob({
              name: 'updateContractStatus',
              data: { contractId: contract.id.toString() },
            });
          }

          // TODO: Get commission related to the subscription
          // TODO: Update Commission status
        }
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
        '[USSD Routes PUT /subscriptions ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        `Sorry, error found during status update of souscription with reference ${req.body.paymentReference}.`,
        res,
      );
    }
  },
);

/**
 * Get customer's contract information
 * @route GET /contracts/:phoneNumber
 */
UssdRouter.get(
  '/contracts/:phoneNumber',
  isApiKeyValid,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('phoneNumber', 'Customer phone number is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 10, max: 14 })
        .run(req);

      // Handle errors if any
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return Helper.apiValidationErrorHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          'Errors where found in submitted request.',
          res,
          errors,
        );
      }

      const phoneNumber = req.params.phoneNumber.toString();

      const customer = await CustomerController.getByParams(
        'phoneNumber',
        phoneNumber,
      );

      if (!Helper.hasNonNullValue(customer, 'id')) {
        return Helper.apiResponseHandler(
          ReasonPhrases.NOT_FOUND,
          getStatusCode(ReasonPhrases.NOT_FOUND),
          false,
          `The given phone number ${phoneNumber}, has no customer account. Please proceed with subscription.`,
          res,
        );
      }

      const contract = await ContractController.getAllByParams(
        'customerId',
        customer.id.toString(),
      );

      if (contract.length == 0) {
        return Helper.apiResponseHandler(
          ReasonPhrases.NOT_FOUND,
          getStatusCode(ReasonPhrases.NOT_FOUND),
          false,
          `The given phone number ${phoneNumber}, has no contract. Please proceed with subscription.`,
          res,
        );
      }

      return Helper.apiResponseHandler(
        ReasonPhrases.OK,
        getStatusCode(ReasonPhrases.OK),
        true,
        `The following contract(s) were found for the given phone number ${phoneNumber}. Please proceed with other services if needed.`,
        res,
        contract,
      );
    } catch (error) {
      logger.error(
        '[USSD Routes GET /contracts/:phoneNumber ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        `Sorry, error found while fetching customer contract(s) with phone number ${req.params.phoneNumber}.`,
        res,
      );
    }
  },
);

/**
 * Get customer's contract status
 * @route GET /contracts/:id/status
 */
UssdRouter.get(
  '/contracts/:contractNumber/status',
  isApiKeyValid,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('contractNumber', 'Contract identifier is invalid')
        .trim()
        .notEmpty()
        .isString()
        .run(req);

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return Helper.apiValidationErrorHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          'Errors where found in submitted request.',
          res,
          errors,
        );
      }

      const contractNumber = req.params.contractNumber;

      const contract = await ContractController.getByParams(
        'contractNumber',
        contractNumber,
      );

      if (!Helper.hasNonNullValue(contract, 'id')) {
        return Helper.apiResponseHandler(
          ReasonPhrases.NOT_FOUND,
          getStatusCode(ReasonPhrases.NOT_FOUND),
          false,
          `The given contract identifier ${contractNumber}, has no match. Please proceed with subscription.`,
          res,
        );
      }

      // Check contract status
      const contractStatus = Helper.calculatePaymentStatus({
        subscriptionDate: new Date(contract.subscription.createdAt),
        premiumPlan: contract.subscription.premiumFee.premiumMonthlyFee,
        totalPaidPremiums: contract.totalPayedPremiums,
      });

      // Log customer's contract status
      logger.info(
        `Customer's contract with identifier "${contract.contractNumber}" present the following status ${JSON.stringify(contractStatus)}`,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.OK,
        getStatusCode(ReasonPhrases.OK),
        true,
        `The status of the contract with identifier ${contract.contractNumber} was successfully retrieved.`,
        res,
        contractStatus,
      );
    } catch (error) {
      logger.error(
        `[USSD Routes POST /contracts/${req.params.contractNumber}/status ] Unexpected error raised`,
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        `Sorry, error found while fetching customer contract status with identifier ${req.params.contractNumber}.`,
        res,
      );
    }
  },
);

/**
 * Create a new premium entry
 * @route POST /premiums
 */
UssdRouter.post(
  '/premiums',
  isApiKeyValid,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('contractNumber', "Customer's contract number is invalid")
        .trim()
        .notEmpty()
        .isString()
        .isLength({ min: 23, max: 23 })
        .run(req);

      await check('paymentReference', 'Payment reference is invalid')
        .trim()
        .notEmpty()
        .isString()
        .run(req);

      // Handle errors if any
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

      const payload: UssdPayloadForCreatingPremium = req.body;

      //Chcek if customer's contract exist
      const contract = await ContractController.getByParams(
        'contractNumber',
        payload.contractNumber,
      );

      if (!Helper.hasNonNullValue(contract, 'id')) {
        // add payload to error logs
        logger.error(
          "[Premium Routes POST /] Customer's contract number doesn't match. ",
          payload,
        );

        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          "Your contract number doesn't match any record. Please contact your insurance provider if you think this is a mistake.",
          res,
        );
      }

      // Check if reference is not duplicate
      const ifExistPremium = await PremiumController.getByParams(
        'paymentReference',
        payload.paymentReference,
      );

      if (Helper.hasNonNullValue(ifExistPremium, 'id')) {
        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          `Premium with payment reference ${payload.paymentReference} already exists. Payment reference should be unique.`,
          res,
        );
      }

      // Chcek if found customer have an active subscription
      const subscription = await SubscriptionController.getById(
        contract.subscription.id.toString(),
      );

      if (!Helper.hasNonNullValue(subscription, 'id')) {
        // add payload to error logs
        logger.error(
          "[Premium Routes POST /] Couldn't find Customer subscription from given phoneNumber. ",
          payload,
        );

        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          "Your phone number doesn't match any record. Please contact your insurance provider if you think this is a mistake.",
          res,
        );
      }

      if (subscription.paymentStatus != PaymentStatus.Successful) {
        return Helper.apiResponseHandler(
          ReasonPhrases.OK,
          getStatusCode(ReasonPhrases.OK),
          true,
          'You do not have a valid subscription. Please contact your insurance provider if you think this is a mistake.',
          res,
        );
      }

      // Get the customer's subscribed montly premium fee
      const premiumfee = await PremiumFeeController.getById(
        contract.subscription.premiumFee.id.toString(),
      );

      if (!Helper.hasNonNullValue(premiumfee, 'id')) {
        // add payload to error logs
        logger.error(
          "[Premium Routes POST /] Couldn't find Insurance premium fee from given phoneNumber. ",
          payload,
        );

        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'Bad request, the provided insurance premium fee id was not found. Please contact your insurance provider if you think this is a mistake.',
          res,
        );
      }

      // Create DB matched payload and store it
      const tempPayload: CreatePremiumDTO = {
        customerId: contract.customer.id,
        contractId: contract.id,
        paymentAmount: premiumfee.premiumMonthlyFee,
        paymentStatus: PaymentStatus.Pending,
        paymentMode: PaymentMode.Manual,
        paymentReference: payload.paymentReference,
      };

      const result = await PremiumController.create(tempPayload);

      let message: string;
      let reasonPhrase: ReasonPhrases;
      let responseStatus: boolean = false;

      if (!result) {
        message =
          'Unexpected error while handling request! Please contact your insurance provider if you think this is a mistake.';
        reasonPhrase = ReasonPhrases.BAD_REQUEST;
      } else {
        message = 'Payment stored successfully.';
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
        '[USSD Routes POST /premiums ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        `Sorry, error found during validation of premium payment with reference ${req.body.paymentReference}.`,
        res,
      );
    }
  },
);

/**
 * Update a premium's paymentStatus
 * @route PUT /premiums
 */
UssdRouter.put(
  '/premiums',
  isApiKeyValid,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const payload: UssdPaylodForUpdatingPremium = req.body;

      if (
        Helper.isEmpty(payload.paymentReference) ||
        (Helper.isEmpty(payload.paymentStatus) &&
          Helper.isEmpty(payload.paymentReference))
      ) {
        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'For an update request payload cannot be empty. Only the payment status could be updated.',
          res,
        );
      }

      await check('paymentReference', 'Payment status is invalid')
        .trim()
        .notEmpty()
        .isString()
        .run(req);

      if (!Helper.isEmpty(payload.paymentStatus)) {
        await check('paymentStatus', 'Payment status is invalid')
          .trim()
          .notEmpty()
          .isString()
          .isIn([PaymentStatus.Failed, PaymentStatus.Successful])
          .run(req);
      }

      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return Helper.apiValidationErrorHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          '[USSD Routes PUT /premiums] Errors where found in submitted request body.',
          res,
          errors,
        );
      }

      // Get premium by param
      const premium = await PremiumController.getByParams(
        'paymentReference',
        payload.paymentReference,
      );

      if (!Helper.hasNonNullValue(premium, 'id')) {
        // add payload to error logs
        logger.error(
          '[USSD Routes PUT /premiums] No record matches the given premium payment reference. ',
          payload,
        );

        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'No record matches the given premium payment reference. Please try again or contact the administrator.',
          res,
        );
      }

      if (premium.paymentStatus === PaymentStatus.Pending) {
        const result = await PremiumController.update(premium.id.toString(), {
          paymentStatus: payload.paymentStatus,
        } as UpdatePremiumDTO);

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

          // Update contract: totalPayedPremiums(premium.paymentAmount)
          await ContractController.update(result.contractId.toString(), {
            totalPayedPremiums: result.paymentAmount,
          });

          // Update contract: contractStatus (ContractStatus.Active)
          await BelifeJobs.addJob({
            name: 'updateContractStatus',
            data: { contractId: result.contractId.toString() },
          });
        }

        return Helper.apiResponseHandler(
          reasonPhrase,
          getStatusCode(reasonPhrase),
          responseStatus,
          message,
          res,
          result,
        );
      }

      return Helper.apiResponseHandler(
        ReasonPhrases.NOT_FOUND,
        getStatusCode(ReasonPhrases.NOT_FOUND),
        false,
        'The status of the premium was already updated. Thank you for your understanding.',
        res,
      );
    } catch (error) {
      logger.error(
        '[USSD Routes PUT /subscriptions ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        `Sorry, error found during status update of premium payment with reference ${req.body.paymentReference}.`,
        res,
      );
    }
  },
);

/**
 * Get all insurances
 * @route GET /insurances
 */
UssdRouter.get(
  '/insurances',
  isApiKeyValid,
  async (req: Request, res: Response): Promise<any> => {
    try {
      const filters: FilterInsuranceDTO = req.query;
      const results = await InsuranceController.getAll(filters);

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
        '[USSD Routes GET /insurances ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        'Sorry an unexpected error was raised. Please try again later or contact the website administrator.',
        res,
      );
    }
  },
);

/**
 * Get all insurance premium fees
 * @route GET /insurances/:id
 */
UssdRouter.get(
  '/insurances/:id',
  isApiKeyValid,
  async (req: Request, res: Response): Promise<any> => {
    try {
      await check('id', 'Insurance identifier is invalid')
        .trim()
        .notEmpty()
        .isString()
        .isUUID(4)
        .run(req);

      // Handle errors if any
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

      // Check if insurance premium fees for the given insurance id exist
      const premiumfees = await PremiumFeeController.getAllByParams(
        'insuranceId',
        id,
      );

      if (premiumfees.length > 0) {
        return Helper.apiResponseHandler(
          ReasonPhrases.OK,
          getStatusCode(ReasonPhrases.OK),
          true,
          '',
          res,
          premiumfees,
        );
      } else {
        return Helper.apiResponseHandler(
          ReasonPhrases.BAD_REQUEST,
          getStatusCode(ReasonPhrases.BAD_REQUEST),
          false,
          'No record found.',
          res,
        );
      }
    } catch (error) {
      logger.error(
        '[USSD Routes GET /insurances/:id ] Unexpected error raised',
        error,
      );

      return Helper.apiResponseHandler(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        getStatusCode(ReasonPhrases.INTERNAL_SERVER_ERROR),
        false,
        'Sorry an unexpected error was raised. Please try again later or contact the website administrator.',
        res,
      );
    }
  },
);

export default UssdRouter;
