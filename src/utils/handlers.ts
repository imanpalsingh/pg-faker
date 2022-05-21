import {Logger} from './loggers/abstracts/Logger.js';

export function gracefulShutdown(message: string, code?: any) {
  Logger.error(`ERROR: ${message}`);
  if (code) Logger.error(code);
  process.exit(1);
}
