// Import modules
import fs from 'fs';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import session, { CookieOptions } from 'express-session';
import sequelizeConnect from 'connect-session-sequelize';
import { rateLimit } from 'express-rate-limit';
import helmet from 'helmet';

// Import logger and helper
import logger from '../logs/logger';

// Import the 'express' module along with 'Request' and 'Response' types from express
import express, { Request, Response } from 'express';

// Import application routes
import routes from './api/routes/postgresql';

// Initialize BullMQ worker
import BelifeWorkerInit from './jobs/worker';
BelifeWorkerInit();

// Initialize PostgreSQL DB
import dbInit from './database/initPostgresql';
import sequelizeConnection from '../configs/sequelize';
dbInit();

const sequelizeStore = sequelizeConnect(session.Store);

// Create an Express application
const app = express();

// Use helmet to secure Express apps by setting HTTP response headers.
app.use(helmet());

// Specify the port number for the server
const port: number = 3500;

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 110, // Limit each IP to 110 requests per window
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  validate: { xForwardedForHeader: false, default: true },
});

// Apply the rate limiting middleware to all requests
app.use(limiter);

const whiteList = [
  'http://localhost:3000',
  'https://backoffice-mobilemtn.prubelife.app',
  'https://ussd-mobilemtn.prubelife.app',
];

// Enable CORS middleware
app.use(
  cors({
    origin: whiteList,
    credentials: true,
  }),
);
app.options('*', cors({ origin: whiteList, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const cookie: CookieOptions = {
  path: '/',
  maxAge: 3600000,
};

let proxy: boolean = false;

if (process.env.NODE_ENV === 'local') {
  cookie.secure = false;
} else {
  cookie.secure = true;
  proxy = true;
}

app.set('trust proxy', 1);
app.use(
  session({
    secret: process.env.NODE_SESSION_SECRET || 'default_secret',
    store: new sequelizeStore({
      db: sequelizeConnection,
    }),
    proxy: proxy,
    resave: false,
    saveUninitialized: false,
    cookie: cookie,
  }),
);
app.use(passport.initialize());
app.use(passport.authenticate('session'));

app.use(
  morgan('common', {
    stream: fs.createWriteStream('./logs/access.log', { flags: 'a' }),
  }),
);

app.use(morgan('combined', { skip: () => process.env.NODE_ENV === 'test' }));

//  Default root route
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Welcome to Belife API 🚀',
    documentation: '/api/v1',
    health: '/health'
  });
});

//  Health check route (optionnel)
app.get('/health', (req: Request, res: Response) => {
  res.status(200).send('Server is healthy ');
});

// Main API routes
app.use('/api/v1', routes);

// Fallback for unhandled routes
app.use((req: Request, res: Response) => {
  logger.warn(`Unknown route: ${req.url}`);
  res.status(404).json({ error: 'Route not found' });
});

// Start the server and listen on the specified port
app.listen(port, () => {
  logger.info(` Server is running on port ${port}`);
});

process.on('uncaughtException', function (exception) {
  logger.error('Unexpected error was raised ', exception);
});

export default app;
