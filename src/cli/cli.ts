import {createWriteStream} from 'fs';
import {join} from 'path'; import {createInterface} from 'readline';
import {ConfigurationType} from '../../types/domain.js';
import {Parser} from '../parser/parse.js';
import {createPgDump} from '../pg/dump.js';
import {PgExtractor} from '../pg/extractors.js';

export async function cli(config: string, args: { [arg: string]: string }) {
  const importPath = join(process.cwd(), config);
  const {configuration}: { configuration: ConfigurationType } = await import(importPath);

  const pgDump = createPgDump(configuration.connectionUrl);

  const inputStream = createInterface({
    input: pgDump.stdout,
    crlfDelay: Infinity,
  }) as any as Iterable<string>;

  const outputStream = createWriteStream(args.output);
  let canWriteToFile = true;
  const parser = new Parser(configuration);

  for await (let line of inputStream) {
    if (PgExtractor.isAComment(line)) {
      canWriteToFile = false;
    } else {
      const query = PgExtractor.parseLine(line);

      if (query) {
        parser.reset();
        canWriteToFile = true;
        if (parser.shouldExecute(query)) {
          parser.parseQuery(query);
        } else {
          canWriteToFile = false;
        }
      } else if (parser.flags.queryDataInProgress) {
        line = parser.parseData(line);
      }
    }

    if (canWriteToFile) outputStream.write(`${line}\n`);
  }
}
