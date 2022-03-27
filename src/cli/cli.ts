import { createInterface } from 'readline';
import { join } from 'path';
import { createWriteStream } from 'fs';
import { createPgDump } from '../pg/dump.js';
import { info, success } from '../utils/loggers.js';
import { ConfigurationType } from '../../types/configuration.js';
import { Parser } from './parse.js';
import { PgExtractors } from '../pg/extracters.js';
import { gracefulShutdown } from '../utils/handlers.js';

export async function cli(config: string, args: { [arg: string]: string }) {
  const importPath = join(process.cwd(), config);
  const { configuration }: { configuration: ConfigurationType } = await import(importPath);

  const parser = new Parser(configuration);
  parser.verifyConfiguration();
  const pg = createPgDump(parser.connectionUrl);

  info(`Starting dump > ${args.output}`);

  const inputLineResults = createInterface({
    input: pg.stdout,
    crlfDelay: Infinity,
  }) as any as Iterable<string>;
  const out = createWriteStream(args.output);

  let table: string | null = null;
  let cols: string[] = [];

  for await (let line of inputLineResults) {
    const data = new PgExtractors(line);

    try {
      if (data.isCopyQuery()) {
        table = data.getTableName();
        cols = data.getCols();
        /*
          Actual data is on the next line of pg_dump
        */
      } else if (table && cols.length && line.trim() && (line !== '\\.')) {
        line = line
          .split('\t')
          // eslint-disable-next-line no-loop-func
          .map((value, index) => parser.applyTransform(value, table as string, cols[index]))
          .join('\t');
      } else {
        table = null;
        cols = [];
      }

      out.write(`${line}\n`);
    } catch (e) {
      gracefulShutdown(e as string);
    }
  }
  success(`Dump Completed : ${args.output}`);
}
