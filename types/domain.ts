/* eslint-disable no-unused-vars */
import {Query} from '../src/pg/queries/abstracts/query';

// eslint-disable-next-line no-unused-vars
export type TransformerType = (value: any) => any;

export type Operation = 'SKIP:MASK' | 'SKIP:OUTPUT';

export interface TableTypes {
  [table_name: string]: {
    [column_name: string]: TransformerType;
  };
}

export interface __TableOperationType {
  [table_name: string]: Operation | ColumnTypes;
}

export interface ColumnTypes {
  [column_name: string]: TransformerType;
}

export interface OptionsType {
  skip?: {
    [table_name: string]: 'output' | 'mask';
  };
}

export interface ConfigurationType {
  connectionUrl: string;
  tables?: TableTypes;
  defaultTransformer?: TransformerType;
  columns?: ColumnTypes;
  options?: OptionsType;
}

export enum VerbosityLevel {
  verbose,
  info,
  silent,
}

export interface AbstractOperationType {
  aoo: __TableOperationType;
  flags: {
    optimizeQuerySearch: boolean;
  };
}

export interface WriteableStream {
  write: (text: string) => void;
}

export interface ExecuterCache {
  tableName: string;
  columns?: Array<string>;
  transformers?: ColumnTypes | null;
}
