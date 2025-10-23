import winston from 'winston';

const sequelizeLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/sequelize.error.log',
      level: 'warn',
    }),
    new winston.transports.File({ filename: 'logs/app.log' }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV !== 'test') {
  sequelizeLogger.add(
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
    }),
  );
}

export default sequelizeLogger;
