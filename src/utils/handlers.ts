import {Logger} from './logger.js';

export function gracefulShutdown(message: string, code?: any) {
  Logger.error(message);
  if (code) Logger.error(code);
  process.exit(1);
}
