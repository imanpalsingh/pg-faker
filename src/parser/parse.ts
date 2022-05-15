import {ParserFlags, ParserProps, QueryDataType} from '../../types/domain.js';
import {DataQuery} from '../pg/queries/abstracts/data-query.js';
import {InfraQuery} from '../pg/queries/abstracts/infra-query.js';
import {Query} from '../pg/queries/abstracts/query.js';
import {Transformer} from './transformer.js';

class Parser {
  configuration: ParserProps;

  transformer: Transformer;

  flags!: ParserFlags;

  queryData!: QueryDataType | null;

  constructor(configuration: ParserProps) {
    this.configuration = configuration;
    const {
      columns, tables, defaultTransformer, options,
    } = configuration;
    this.transformer = new Transformer({
      columns, tables, defaultTransformer, options,
    });
    this.reset();
  }

  reset() {
    this.flags = {
      queryDataInProgress: false,
      currentQuery: null,
    };
    this.queryData = null;
  }

  shouldExecute(query: Query) {
    if (query instanceof InfraQuery) return true;
    return !this.transformer.options.shouldSkipTableForOutput(query.tableName);
  }

  parseQuery(query: Query) {
    if (query instanceof DataQuery) {
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
      return data.split('\t')
          // eslint-disable-next-line max-len
          .map((value: string, index: number) => this.transformer.applyTransform(value, this.queryData!.table, this.queryData!.columns[index])).join('\t');
    }
    return data;
  }
}

export {Parser};
