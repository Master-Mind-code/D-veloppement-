import { Router } from 'express';
import CustomerRouter from './customer';
import UserRouter from './user';
import AuthRouter from './auth';
import BeneficiaryRouter from './beneficiary';
import SubscriptionRouter from './subscription';
import UssdRouter from './ussd';
import InsuranceRouter from './insurance';
import ContractRouter from './contract';
import PremiumRouter from './premium';
import PremiumFeeRouter from './premiumfee';

const router = Router();

router.use('/auth', AuthRouter);
router.use('/users', UserRouter);
router.use('/insurances', InsuranceRouter);
router.use('/customers', CustomerRouter);
router.use('/beneficiaries', BeneficiaryRouter);
router.use('/subscriptions', SubscriptionRouter);
router.use('/premiums', PremiumRouter);
router.use('/premiumfees', PremiumFeeRouter);
router.use('/ussd', UssdRouter);
router.use('/contracts', ContractRouter);

export default router;
