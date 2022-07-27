import {join} from 'path';
import {ConfigurationType, WriteableStream} from '../../types/domain.js';
import parser from './parser.js';
import {createPgDump} from '../pg/dump.js';
import {gracefulShutdown} from '../utils/handlers.js';
import {createInputStream, createOutputStream} from '../utils/io.js';
import {Logger} from '../utils/logger.js';
import engine from './engine.js';

class Driver {
  async loadConfiguration(path: string) {
    const importPath = join(process.cwd(), path);
    const {configuration}: {configuration: ConfigurationType} = await import(importPath);
    if (!configuration) {
      throw new Error(
        // eslint-disable-next-line max-len
        `Configuration could not be found in ${importPath}. Make sure the js file exports object named 'configuration' `,
      );
    }

    return configuration;
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

  run = async (config: string, args: {[arg: string]: string}) => {
    try {
      const logger = new Logger(args.verbose);
      const configuration = await this.loadConfiguration(config);

      logger.startParse(config);
      const payload = this.parse(configuration);

      logger.fetchDump();
      const streams = this.createIOStreams(configuration.connectionUrl, args.output);

      logger.startDump(args.output);
      await engine.execute(payload, streams.input, streams.output, logger);

      logger.complete();
    } catch (error: any) {
      gracefulShutdown(error);
    }
  };
}

export {Driver};
export default new Driver();
