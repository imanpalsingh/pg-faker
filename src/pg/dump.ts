import {spawn} from 'child_process';
import {gracefulShutdown} from '../utils/handlers.js';

export function createPgDump(connectionUrl: string) {
  const pg = spawn('pg_dump', [connectionUrl]);

  pg.on('exit', (code) => {
    if (code !== 0) {
      gracefulShutdown('pg_dump command failed with exit code', code);
    }
  });
  pg.stderr.on('data', (data) => {
    gracefulShutdown('pg_dump command error:', data);
  });

  pg.stdout.setEncoding('utf-8');
  return pg;
}
