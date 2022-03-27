// eslint-disable-next-line no-unused-vars
export type Transformer = (value: any) => any;

export interface TableTypes {
  [table_name: string]: {
    [column_name: string]: Transformer;
  };
}

export interface ColumnTypes {
  [column_name: string]: Transformer;
}

export interface ConfigurationType {
  connectionUrl: string;
  tables: TableTypes;
  defaultTransformer: Transformer;
  columns: ColumnTypes;
}
