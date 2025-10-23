import logger from '../../logs/logger';
import Beneficiary from './models/postgresql/beneficiary';
import Contract from './models/postgresql/contract';
import Customer from './models/postgresql/customer';
import Insurance from './models/postgresql/insurance';
import Premium from './models/postgresql/premium';
import PremiumFee from './models/postgresql/premiumfee';
import Session from './models/postgresql/session';
import Subscription from './models/postgresql/subscription';
import User from './models/postgresql/user';
import CommissionRate from './models/postgresql/comissionrate';
import Team from './models/postgresql/team';
import Municipality from './models/postgresql/municipality';
import Agent from './models/postgresql/agent';
import Commission from './models/postgresql/commission';

const isDev = process.env.NODE_ENV != 'production';

const dbInit = async () => {
  try {
    await User.sync({ alter: isDev });
    await Session.sync({ alter: isDev });

    await Customer.sync({ alter: isDev });
    await Beneficiary.sync({ alter: isDev });
    await Insurance.sync({ alter: isDev });
    await PremiumFee.sync({ alter: isDev });
    await Subscription.sync({ alter: isDev });
    await Contract.sync({ alter: isDev });
    await Premium.sync({ alter: isDev });
    await CommissionRate.sync({ alter: isDev });
    await Team.sync({ alter: isDev });
    await Municipality.sync({ alter: isDev });
    await Agent.sync({ alter: isDev });
    await Commission.sync({ alter: isDev });
  } catch (error) {
    logger.error(`Error synchronizing models: ${JSON.stringify(error)}`);
  }
};

export default dbInit;
