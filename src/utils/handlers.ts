import {error} from './loggers.js';

export function gracefulShutdown(message: string, code?: any) {
  error(`ERROR: ${message}`);
  if (code) error(code);
  process.exit(1);
}
