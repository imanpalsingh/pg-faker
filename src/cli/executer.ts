import {
  AbstractOperationType,
  ColumnTypes,
  ExecuterCache,
  VerbosityLevel,
  WriteableStream,
} from '../../types/domain';
import {queries} from '../pg/queries';
import {DataQuery} from '../pg/queries/abstracts/data-query';
import {InfraQuery} from '../pg/queries/abstracts/infra-query';
import {Query} from '../pg/queries/abstracts/query';
import {Logger} from '../utils/loggers/logger';

class Executer {
  queries!: Array<Query>;
  aoo!: AbstractOperationType['aoo'];
  logger!: Logger;

  cache!: ExecuterCache | null;

  shouldSkipMasking(tableName: string) {
    return this.aoo[tableName] === 'SKIP:MASK';
  }

  shouldSkipOutput(tableName: string) {
    return this.aoo[tableName] === 'SKIP:OUTPUT';
  }

  setUpQueries(payload: AbstractOperationType) {
    this.aoo = payload.aoo;

    if (payload.flags.optimizeQuerySearch) {
      /*
      This means that options feature was not used.
      The query search can be optimized by not including non DataQuery queries
      as they are required only when using options
    */

      this.queries = queries.filter((query) => query instanceof DataQuery);
    } else {
      this.queries = queries;
    }
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

  apply(query: Query) {
    this.cache = {tableName: query.tableName};

    if (!this.canExecute(query)) return false;

    if (query instanceof DataQuery) {
      this.logger.currentTable(query.tableName);
      this.cache.columns = query.columns;
      const operations = this.aoo[this.cache.tableName];

      if (!(operations instanceof String)) {
        /*
            If actual transformers are given for the table and not options
        */

        const columnsInTable = this.cache.columns;
        let transformers: ColumnTypes | null;

        /*
            Extracting the table specific transformers early
        */

        if (this.shouldSkipMasking(this.cache.tableName)) {
          this.logger.skipTableFromMasking(this.cache.tableName);
          transformers = null;
        } else {
          transformers = columnsInTable
            .filter((key: string) => operations.hasOwnProperty(key))
            .reduce(
              (subset: ColumnTypes, key) => (
                (subset[key] = (operations as ColumnTypes)[key]), subset
              ),
              {},
            );
        }

        this.cache.transformers = transformers;

        if (this.logger.verbosityLevel < VerbosityLevel.silent) {
          /*
              Do not do this computation if not asked for
          */

          if (!transformers) {
            this.logger.nothingTransformed();
          }

          const affectedColumns = Object.keys(transformers!);
          const unaffectedColumns = columnsInTable.filter(
            (column) => !affectedColumns.includes(column),
          );

          this.logger.transformedColumns(affectedColumns);
          this.logger.skippedColumns(unaffectedColumns);
        }
      }
    }

    return true;
  }

  transform(line: string) {
    if (!this.cache?.transformers) return line;
    if (!line.trim() || line === `\\.`) return line;

    const record = line.split('\t');
    const transformers = this.cache.transformers;
    const columns = this.cache.columns;

    const maskedData = record.map((value: String, index) => {
      if (transformers.hasOwnProperty(columns![index])) {
        return transformers[columns![index]](value);
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

export {Executer};
export default new Executer();