import {
  AbstractOperationType,
  ConfigurationType,
  OptionsType,
  TableTypes,
  __TableOperationType,
} from '../../types/domain.js';
import {gracefulShutdown} from '../utils/handlers.js';
import {Logger} from '../utils/logger.js';

class Parser {
  validate(configuration: ConfigurationType) {
    if (!configuration.connectionUrl) {
      gracefulShutdown('connectionUrl is missing, cannot connect to database without it');
      return;
    }
  }

  parseOptions(tables: TableTypes, options: OptionsType) {
    /*
    Each option is an operation that the parser has to identify.
  */
    const parsedTables: __TableOperationType = tables;

    /*
      Skip Operation
    */

    const skippers = options.skip;

    if (!skippers) return parsedTables;

    for (const [table, skipType] of Object.entries(skippers)) {
      if (table in tables) {
        Logger.warn(`${table} is set to mask and to skip ${skipType}. The latter will be used`);
      }
      switch (skipType) {
        case 'mask':
          parsedTables[table] = 'SKIP:MASK';
          break;
        case 'output':
          parsedTables[table] = 'SKIP:OUTPUT';
          break;
        default:
          gracefulShutdown(`Unrecognized skipping method ${skipType}`);
      }
    }

    return parsedTables;
  }

  parse(configuration: ConfigurationType): AbstractOperationType {
    const {tables, columns, options, defaultTransformer} = configuration;
    let parsedTables: TableTypes | __TableOperationType | undefined = tables;

    this.validate(configuration);

    if (options) {
      parsedTables = this.parseOptions(tables ?? {}, options);
    }

    return {
      aoo: {
        ...(parsedTables && {tables: parsedTables}),
        ...(columns && {columns: columns}),
        ...(defaultTransformer && {defaultTransformer: defaultTransformer}),
      },
    };
  }
}

export {Parser};
export default new Parser();
