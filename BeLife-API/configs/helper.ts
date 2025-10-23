import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Response } from 'express';
import { Result, ValidationError } from 'express-validator';
import { format } from 'date-fns';

import logger from '../logs/logger';
import { SubscriptionPopulated } from '../src/database/interfaces/postgresql';
import { UssdPayloadForCreatingSubscription } from '../src/database/dto/postgresql/subscription.dto';
import { PaymentStatus, SubscriptionDetails } from '../src/database/types';

import SubscriptionController from '../src/api/controllers/postgresql/subscription';

type ValidationResponse = {
  message: string;
  isValid: boolean;
};

const Helper = {
  isEmpty: (value: string | undefined) =>
    value === undefined || value.trim().length === 0,
  hasNonNullValue: (object: object, key: string) => {
    return (
      object &&
      Object.prototype.hasOwnProperty.call(object, key) &&
      object[key] !== null &&
      object[key] !== undefined
    );
  },
  apiValidationErrorHandler: (
    name: ReasonPhrases,
    httpCode: StatusCodes,
    message: string,
    res: Response,
    error: Result<ValidationError>,
  ) => {
    logger.error(message, error);

    return res.status(httpCode).json({
      status: false,
      description: name,
      message: message,
      errors: error.array(),
    });
  },
  operationalErrorHandler: (
    name: ReasonPhrases,
    httpCode: StatusCodes,
    location: string,
    res: Response,
    error: Error,
  ) => {
    logger.error(location, error);

    return res.status(httpCode).json({
      status: false,
      description: name,
      message: error?.message,
    });
  },
  apiResponseHandler: (
    name: ReasonPhrases,
    httpCode: StatusCodes,
    responseStatus: boolean,
    message: string,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data?: any,
  ) => {
    return res.status(httpCode).json({
      status: responseStatus,
      description: name,
      message: message,
      data: data,
    });
  },
  formatPhoneNumber: (phoneNumber: string): string => {
    const prefixRegex = /^\+(22505)|^(0022505)|^(22505)/;
    const match = phoneNumber.match(prefixRegex);

    if (match) {
      return phoneNumber.slice(match[0].length - 2);
    } else {
      return phoneNumber;
    }
  },
  contractNumberGenerator: (phoneNumber: string): string => {
    const formattedPhoneNumber = Helper.formatPhoneNumber(phoneNumber);

    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hours = currentDate.getHours().toString().padStart(2, '0');
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const seconds = currentDate.getSeconds().toString().padStart(2, '0');

    const formattedDate = day + month + year;
    const formattedTime = hours + minutes + seconds;

    return formattedPhoneNumber + 'M' + formattedDate + formattedTime;
  },
  validateSubscription: (
    ifExitSubscription: SubscriptionPopulated[],
    payload: UssdPayloadForCreatingSubscription,
  ): ValidationResponse => {
    // Check if payment reference already exists
    const existingPaymentReference = ifExitSubscription.find(
      (subscription) =>
        subscription.paymentReference === payload.paymentReference,
    );
    if (existingPaymentReference) {
      return {
        message: `Subscription with payment reference ${existingPaymentReference.paymentReference} already exists. Payment reference should be unique.`,
        isValid: false,
      };
    }

    // Filter subscriptions by payment status "REUSSI"
    const activeSubscriptions = ifExitSubscription.filter(
      (subscription) => subscription.paymentStatus === PaymentStatus.Successful,
    );

    // Check if customer reached subscription limit (3 active subscriptions)
    // TODO: Make the limit as a parameter
    if (activeSubscriptions.length >= 3) {
      return {
        message: `Customer with phone number "${payload.customer.phoneNumber}" has reached the maximum subscription limit`,
        isValid: false,
      };
    }

    // Check if beneficiary already has an active subscription
    const existingBeneficiary = activeSubscriptions.find(
      (subscription) =>
        subscription.beneficiary.fullName === payload.beneficiary.fullName,
    );

    // Return validation result
    if (existingBeneficiary) {
      return {
        message: `Customer with name "${payload.customer.fullName}" with Beneficiary "${payload.beneficiary.fullName}" already has an active subscription`,
        isValid: false,
      };
    }

    // Check if beneficiary already has an active subscription with the same customer and "ECHOUE" or "EN_ATTENTE" status
    const existingFailedSubscription = ifExitSubscription.find(
      (subscription) =>
        subscription.beneficiary.fullName === payload.beneficiary.fullName &&
        subscription.customer.fullName === payload.customer.fullName &&
        subscription.paymentStatus ===
          (PaymentStatus.Failed || PaymentStatus.Pending),
    );
    if (existingFailedSubscription) {
      // Delete the existing failed subscription
      SubscriptionController.deleteById(
        existingFailedSubscription.id.toString(),
      )
        .then(() => {
          logger.info(
            `Deleted existing failed/pending status subscription with ID ${existingFailedSubscription.id}`,
          );
        })
        .catch((error) => {
          logger.error(
            `Error deleting failed/pending status subscription: ${error}`,
          );
        });
    }

    return {
      message: 'Subscription validation successful',
      isValid: true,
    };
  },
  calculatePaymentStatus: (
    subscriptionDetails: SubscriptionDetails,
  ): {
    expectedPayments: number;
    expectedTotalPayment: number;
    isUpToDate: boolean;
    missedPayments: { month: string; amount: number }[];
  } => {
    const { subscriptionDate, premiumPlan, totalPaidPremiums } =
      subscriptionDetails;

    // Get the current month and year
    const Month = subscriptionDate.getMonth();
    const currentYear = subscriptionDate.getFullYear();

    // Create dates for the 1st and 15th of the current month
    const firstDayOfMonth = new Date(currentYear, Month, 1);
    const sixteenthDayOfMonth = new Date(currentYear, Month, 16);

    let contractStartDate: Date;

    // Check if subscriptionDate is between the two dates
    if (
      subscriptionDate >= firstDayOfMonth &&
      subscriptionDate < sixteenthDayOfMonth
    ) {
      // Calculate contract start date (1st of the current month)
      contractStartDate = new Date(
        subscriptionDate.getFullYear(),
        subscriptionDate.getMonth(),
        1,
      );
    } else {
      // Calculate contract start date (1st of the next month)
      contractStartDate = new Date(
        subscriptionDate.getFullYear(),
        subscriptionDate.getMonth() + 1,
        1,
      );
    }

    // Calculate the number of months elapsed since the contract start date
    const currentDate = new Date();
    const monthsElapsed = Helper.calculateElapsedMonths(
      subscriptionDate,
      currentDate,
    );

    // Calculate expected payments and total amount
    const expectedPayments = monthsElapsed;
    const expectedTotalPayment = expectedPayments * premiumPlan;

    // Determine if the customer is up-to-date
    const isUpToDate = totalPaidPremiums >= expectedTotalPayment;

    // Calculate missed payments
    const missedPayments: { month: string; amount: number }[] = [];
    let remainingAmount = expectedTotalPayment - totalPaidPremiums;
    let currentMonth = contractStartDate;

    if (remainingAmount > 0 && currentMonth > currentDate) {
      missedPayments.push({
        month: currentMonth.toString(),
        amount: premiumPlan,
      });
    }

    while (remainingAmount > 0 && currentMonth <= currentDate) {
      missedPayments.push({
        month: format(currentMonth, 'MMMM yyyy'),
        amount: premiumPlan,
      });
      remainingAmount -= premiumPlan;
      currentMonth = new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1,
      );
    }

    return {
      expectedPayments,
      expectedTotalPayment,
      isUpToDate,
      missedPayments,
    };
  },
  calculateElapsedMonths(subscriptionDate: Date, currentDate: Date): number {
    const contractStartDate =
      subscriptionDate.getDate() < 16
        ? new Date(
            subscriptionDate.getFullYear(),
            subscriptionDate.getMonth(),
            1,
          )
        : new Date(
            subscriptionDate.getFullYear(),
            subscriptionDate.getMonth() + 1,
            1,
          );

    // If the current month is the same as the contract start month,
    // we consider it as one month elapsed, even if it's not the end of the month yet.
    if (
      currentDate.getFullYear() === contractStartDate.getFullYear() &&
      currentDate.getMonth() === contractStartDate.getMonth()
    ) {
      return 1;
    }

    // If the current month is greater than the contract month, the year has changed
    // we consider it as one month elapsed, even if we are not in the contract date month.
    if (
      currentDate.getMonth() > contractStartDate.getMonth() &&
      currentDate.getFullYear() < contractStartDate.getFullYear()
    ) {
      return 1;
    }

    // Calculate the difference in months
    let monthsDiff =
      (currentDate.getFullYear() - contractStartDate.getFullYear()) * 12;
    monthsDiff += currentDate.getMonth() - contractStartDate.getMonth() + 1; // We are adding 1 because we are counting the subscription month too

    // Ensure the result is non-negative to avoid negative month counts
    return Math.max(0, monthsDiff);
  },
  contractTotalPayedPremiumsCalculator: (
    current_value: number,
    payed_premiums_fee: number,
  ): number => {
    return (
      parseInt(current_value.toString()) +
      parseInt(payed_premiums_fee.toString())
    );
  },
};

export default Helper;
