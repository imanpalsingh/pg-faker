import {Query} from '../src/pg/queries/abstracts/query';

// eslint-disable-next-line no-unused-vars
export type TransformerType = (value: any) => any;

export interface TableTypes {
  [table_name: string]: {
    [column_name: string]: TransformerType;
  };
}

export interface ColumnTypes {
  [column_name: string]: TransformerType;
}

export interface OptionsType {
  skip: {
    [table_name: string]: 'output' | 'mask'
  }
}

export interface ConfigurationType {
  connectionUrl: string;
  tables?: TableTypes;
  defaultTransformer?: TransformerType;
  columns?: ColumnTypes;
  options?: OptionsType
}

export interface DriverData {
  shouldWrite: boolean;
  inProgress: boolean;
}

export type ParserProps = Pick<ConfigurationType, 'columns' | 'tables' | 'defaultTransformer' | 'options'>

export interface ParserFlags {
  currentQuery: Query | null
  queryDataInProgress: boolean
}

export interface QueryDataType {
  table: string;
  columns: string[]
}

export interface TransformerProps {
  columns?: ColumnTypes,
  tables?: TableTypes,
  defaultTransformer?: TransformerType
  options?: OptionsType
}

