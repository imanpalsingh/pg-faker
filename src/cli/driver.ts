import {join} from 'path';
import {ConfigurationType, WriteableStream} from '../../types/domain.js';
import parser from '../parser/parser.js';
import {createPgDump} from '../pg/dump.js';
import {createInputStream, createOutputStream} from '../utils/io.js';
import {Logger} from '../utils/loggers/logger.js';
import executer from './executer.js';

class Driver {
  async loadConfiguration(path: string) {
    const importPath = join(process.cwd(), path);
    return import(importPath);
  }

  parse(configuration: ConfigurationType) {
    return parser.parse(configuration);
  }

  createIOStreams(source: string, destination: string) {
    const pgDump = createPgDump(source);
    const inputStream = createInputStream(pgDump.stdout);
    const outputStream: WriteableStream = createOutputStream(destination);

    return {
      input: inputStream,
      output: outputStream,
    };
  }

  async run(config: string, args: {[arg: string]: string}) {
    const logger = new Logger(args.verbose);
    const configuration: ConfigurationType = await this.loadConfiguration(config);

    logger.startParse(config);
    const payload = this.parse(configuration);

    logger.fetchDump();
    const streams = this.createIOStreams(configuration.connectionUrl, args.output);

    logger.startDump(args.output);
    executer.execute(payload, streams.input, streams.output, logger);

    logger.complete();
  }
}

export {Driver};
export default new Driver();
