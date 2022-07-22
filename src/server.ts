import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import IndexRoute from './routes/index.route';
import { logError, logInfo } from './utils/util';

validateEnv();

const app = new App([new IndexRoute()]);

async function exitHandler(options, exitCode) {
  if (options.cleanup) logInfo('clean');
  if (exitCode === 0) logInfo(`Cleanly exiting application with exit code ${exitCode}`);
  if (exitCode) logError(`Server errored out with exit code ${exitCode}`);
  if (options.exit) {
    logInfo(`Server is exiting`);
    await app.close();
    process.exit();
  }
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));

// This function is async. But it's okay within the context of server.ts
app.listen();
