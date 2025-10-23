import cluster from 'cluster';
import os from 'os';
// import { dirname } from 'path';
// import { fileURLToPath } from 'url';

import logger from '../logs/logger';

// const __dirname = dirname(fileURLToPath(import.meta.url));

console.log(__dirname);

const cpuCount = os.cpus().length;

logger.info(`The total number of CPUs is ${cpuCount}`);
logger.info(`Primary pid=${process.pid}`);
cluster.setupPrimary({
  exec: __dirname + '/app.ts',
});

for (let i = 0; i < cpuCount; i++) {
  cluster.fork();
}

cluster.on('exit', (worker, code, signal) => {
  logger.warn(`worker ${worker.process.pid} has been killed`);
  logger.info('Starting another worker');
  logger.info(`Cluster code: ${code}`);
  logger.info(`Cluster signal: ${signal}`);

  cluster.fork();
});
