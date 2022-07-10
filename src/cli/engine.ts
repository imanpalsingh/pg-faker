import {
  AbstractOperationType,
  ColumnTypes,
  EngineCache,
  Operation,
  VerbosityLevel,
  WriteableStream,
} from '../../types/domain.js';
import {queries} from '../pg/queries/index.js';
import {DataQuery} from '../pg/queries/abstracts/data-query.js';
import {InfraQuery} from '../pg/queries/abstracts/infra-query.js';
import {Query} from '../pg/queries/abstracts/query.js';
import {Logger} from '../utils/logger.js';
import {isEmptyObject} from '../utils/checkers.js';

class Engine {
  queries!: Array<Query>;
  aoo!: AbstractOperationType['aoo'];
  logger!: Logger;

  cache!: EngineCache | null;

  shouldSkipMasking(tableName: string) {
    if (this.aoo.tables) {
      return this.aoo.tables[tableName] === 'SKIP:MASK';
    }

    return false;
  }

  shouldSkipOutput(tableName: string) {
    if (this.aoo.tables) {
      return this.aoo.tables[tableName] === 'SKIP:OUTPUT';
    }
    return false;
  }

  setUpQueries(payload: AbstractOperationType) {
    this.aoo = payload.aoo;
    this.queries = queries;
  }

  isAComment(line: string) {
    return line.match(/^--.*/g);
  }

  parseLine(line: string) {
    const queryObj = this.queries.find((query) => query.match(line));
    if (queryObj) {
      queryObj.query = line;
      return queryObj;
    }

    return null;
  }

  canExecute(query: Query): boolean {
    if (query instanceof InfraQuery) return true;

    /*
        Conditions on which the query should not execute go here
    */

    const tableName = query.tableName;

    if (this.shouldSkipOutput(tableName)) {
      this.logger.skipTableFromOutput(tableName);
      return false;
    }

    return true;
  }

  requiredTransformers(operations: ColumnTypes) {
    if (this.shouldSkipMasking(this.cache!.tableName)) {
      this.logger.skipTableFromMasking(this.cache!.tableName);
      return null;
    } else {
      const transformers = this.cache!.columns!.filter((key: string) =>
        operations.hasOwnProperty(key),
      ).reduce(
        (subset: ColumnTypes, key) => ((subset[key] = (operations as ColumnTypes)[key]), subset),
        {},
      );

      return isEmptyObject(transformers) ? null : transformers;
    }
  }

  apply(query: Query) {
    this.cache = {tableName: query.tableName};

    if (!this.canExecute(query)) return false;

    if (query instanceof DataQuery) {
      this.logger.currentTable(query.tableName);
      this.cache.columns = query.columns;
      let operations: Operation | ColumnTypes;

      if (this.aoo.tables) {
        operations = this.aoo.tables[this.cache.tableName];

        if (!(operations instanceof String)) {
          /*
            If actual transformers are given for the table and not options
          */

          operations = {...(operations as ColumnTypes), ...this.aoo.columns};

          this.cache.transformers = this.requiredTransformers(operations);
        }
      } else if (this.aoo.columns) {
        this.cache.transformers = this.requiredTransformers(this.aoo.columns);
      }

      if (this.logger.verbosityLevel < VerbosityLevel.silent) {
        /*
              Do not do this computation if not asked for
          */
        if (!this.cache.transformers) {
          this.logger.nothingTransformed();
        } else {
          const affectedColumns = Object.keys(this.cache.transformers);
          const unaffectedColumns = this.cache.columns.filter(
            (column) => !affectedColumns.includes(column),
          );

          this.logger.skippedColumns(unaffectedColumns);
          this.logger.transformedColumns(affectedColumns);
        }
      }
    }

    return true;
  }

  transform(line: string) {
    if (!(this.cache?.transformers || this.aoo.defaultTransformer)) return line;
    if (!line.trim() || line === `\\.`) return line;

    const record = line.split('\t');
    const transformers = this.cache?.transformers;
    const columns = this.cache?.columns;

    const maskedData = record.map((value: String, index) => {
      if (transformers?.hasOwnProperty(columns![index])) {
        return transformers[columns![index]](value);
      } else if (this.aoo.defaultTransformer) {
        return this.aoo.defaultTransformer(value);
      }
      return value;
    });

    return maskedData.join(`\t`);
  }

  async execute(
    abstractOperationObject: AbstractOperationType,
    source: Iterable<string>,
    destination: WriteableStream,
    logger: Logger,
  ) {
    this.setUpQueries(abstractOperationObject);
    this.logger = logger;

    let canWriteToFile: boolean = true;

    for await (let line of source) {
      if (this.isAComment(line)) {
        canWriteToFile = false;
      } else {
        const query = this.parseLine(line);

        if (query) {
          canWriteToFile = this.apply(query);
        } else if (this.cache?.columns) {
          /*
            Query data in progress
          */
          line = this.transform(line);
        }
      }

      if (canWriteToFile) destination.write(`${line}\n`);
    }
  }
}

export {Engine};
export default new Engine();
