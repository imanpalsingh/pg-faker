import {ParserFlags, ParserProps, QueryDataType, VerbosityLevel} from '../../types/domain.js';
import {DataQuery} from '../pg/queries/abstracts/data-query.js';
import {InfraQuery} from '../pg/queries/abstracts/infra-query.js';
import {Query} from '../pg/queries/abstracts/query.js';
import {Logger} from '../utils/loggers/abstracts/Logger.js';
import {Transformer} from './transformer.js';

class Parser {
  configuration: ParserProps;

  transformer: Transformer;

  flags!: ParserFlags;

  queryData!: QueryDataType | null;

  log: Logger;

  constructor(configuration: ParserProps, logger: Logger) {
    this.configuration = configuration;
    const {
      columns, tables, defaultTransformer, options,
    } = configuration;
    this.log = logger;
    this.transformer = new Transformer({
      columns, tables, defaultTransformer, options,
    }, this.log);
    this.reset();
  }

  logLogic() {
    if (this.queryData?.columns?.length) {
      const transformedColumns = this.transformer.columnsTransformed;
      const allColumns = this.queryData?.columns;
      const unaffectedColumns = allColumns?.filter((col) => !transformedColumns.includes(col));

      if (transformedColumns?.length === 0) {
        this.log.nothingTransformed();
      } else {
        this.log.transformedColumns(transformedColumns);
        this.log.skippedColumns(unaffectedColumns ?? []);
      }
    }
  }

  reset() {
    /*
      Do not do computation for logging if not asked for
    */
    this.log.verbosityLevel < VerbosityLevel.silent && this.logLogic();
    this.transformer.prepareForNewQuery();
    this.flags = {
      queryDataInProgress: false,
      currentQuery: null,
    };
    this.queryData = null;
  }

  shouldExecute(query: Query) {
    if (query instanceof InfraQuery) return true;

    if (this.transformer.options.shouldSkipTableForOutput(query.tableName)) {
      this.log.skipTableFromOutput(query.tableName);
      return false;
    }
    return true;
  }

  parseQuery(query: Query) {
    if (query instanceof DataQuery) {
      this.log.currentTable(query.tableName);
      this.flags = {
        currentQuery: query,
        queryDataInProgress: true,
      };
      this.queryData = {
        table: query.tableName,
        columns: query.columns,
      };
    }
  }

  parseData(data: string) {
    if (data.trim() && data !== '\\.') {
      const maskedData = data.split('\t')
      // eslint-disable-next-line max-len
          .map((value: string, index: number) => this.transformer.applyTransform(value, this.queryData!.table, this.queryData!.columns[index])).join('\t');
      this.transformer.trackColumns = false;
      return maskedData;
    }

    return data;
  }
}

export {Parser};
