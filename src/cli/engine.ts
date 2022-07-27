import {
  AbstractOperationType,
  ColumnTypes,
  EngineCache,
  ExecuterInstructions,
  VerbosityLevel,
  WriteableStream,
} from '../../types/domain.js';
import {indexOnQueries} from '../pg/queries/index.js';
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

  #shouldSkipMasking(tableName: string) {
    if (this.aoo.tables) {
      return this.aoo.tables[tableName] === 'SKIP:MASK';
    }

    return false;
  }

  #shouldSkipOutput(tableName: string) {
    if (this.aoo.tables) {
      return this.aoo.tables[tableName] === 'SKIP:OUTPUT';
    }
    return false;
  }

  #setUpQueries(payload: AbstractOperationType) {
    this.aoo = payload.aoo;
  }

  #isAComment(line: string) {
    return line.match(/^--.*/g);
  }

  #parseLine(line: string) {
    const firstChar = line[0];
    if (firstChar >= '0' && firstChar <= '9') {
      return null;
    }

    const [firstWord] = line.split(' ', 1);

    if (firstWord in indexOnQueries) {
      const queriesInScope = indexOnQueries[firstWord as keyof typeof indexOnQueries];

      const queryObj = queriesInScope.find((query) => query.match(line));
      if (queryObj) {
        queryObj.query = line;
        return queryObj;
      }
    }

    return null;
  }

  #canExecute(query: Query): boolean {
    if (query instanceof InfraQuery) return true;

    /*
        Conditions on which the query should not execute go here
    */

    const tableName = query.tableName;

    if (this.#shouldSkipOutput(tableName)) {
      this.logger.skipTableFromOutput(tableName);
      return false;
    }

    return true;
  }

  #requiredTransformers(operations: ColumnTypes) {
    if (this.#shouldSkipMasking(this.cache!.tableName)) {
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

  #apply(query: Query) {
    this.cache = {tableName: query.tableName};

    if (!this.#canExecute(query)) return false;

    if (query instanceof DataQuery) {
      this.logger.currentTable(query.tableName);
      this.cache.columns = query.columns;
      let tableOperations = this.aoo.tables?.[this.cache.tableName];

      if (Array.isArray(tableOperations)) {
        const [middleware, transforms] = tableOperations;
        const requiredTransformers = this.#requiredTransformers({
          ...transforms,
          ...this.aoo.columns,
        });
        this.cache.transformers = [middleware, requiredTransformers || {}];
      } else {
        tableOperations = {...(tableOperations as ColumnTypes), ...this.aoo.columns};
        this.cache.transformers = this.#requiredTransformers(tableOperations);
      }

      if (this.logger.verbosityLevel < VerbosityLevel.silent) {
        /*
              Do not do this computation if not asked for
          */

        let transformers = this.cache.transformers;
        if (!transformers) {
          this.logger.nothingTransformed();
        } else {
          if (Array.isArray(transformers)) {
            [, transformers] = transformers as ExecuterInstructions;
          }
          const affectedColumns = Object.keys(transformers);
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

  #transform(line: string) {
    if (!(this.cache?.transformers || this.aoo.defaultTransformer)) return line;
    if (!line.trim() || line === `\\.`) return line;

    const record = line.split('\t');
    const transformers = this.cache?.transformers;
    const columns = this.cache?.columns;
    let maskedData: string[];

    if (Array.isArray(transformers)) {
      const [middleware, mapping] = transformers;
      const passedRecord = middleware(record, columns!);
      if (passedRecord) {
        maskedData = this.#declarativeTransformation(passedRecord, mapping);
      } else {
        maskedData = record;
      }
    } else {
      maskedData = this.#declarativeTransformation(record, transformers!);
    }

    return maskedData.join(`\t`);
  }

  #declarativeTransformation(record: string[], transformers: ColumnTypes): string[] {
    const columns = this.cache?.columns;
    return record.map((value: String, index: number) => {
      if (transformers?.hasOwnProperty(columns![index])) {
        const currentColumn = columns![index];
        const action = transformers[currentColumn];

        if (typeof action === 'function') {
          return transformers[currentColumn](value);
        } else {
          throw new Error(
            `Invalid transformer provided for column ${currentColumn} of table ${this.cache?.tableName}.`,
          );
        }
      } else if (this.aoo.defaultTransformer) {
        return this.aoo.defaultTransformer(value);
      }
      return value;
    });
  }

  async execute(
    abstractOperationObject: AbstractOperationType,
    source: Iterable<string>,
    destination: WriteableStream,
    logger: Logger,
  ) {
    this.#setUpQueries(abstractOperationObject);
    this.logger = logger;

    let canWriteToFile: boolean = true;

    for await (let line of source) {
      if (this.#isAComment(line)) {
        canWriteToFile = false;
      } else {
        const query = this.#parseLine(line);

        if (query) {
          canWriteToFile = this.#apply(query);
        } else if (this.cache?.columns) {
          /*
            Query data in progress
          */
          line = this.#transform(line);
        }
      }

      if (canWriteToFile) destination.write(`${line}\n`);
    }
  }
}

export {Engine};
export default new Engine();
