import { ConfigurationType, Transformer } from '../../types/configuration.js';
import { gracefulShutdown } from '../utils/handlers.js';

class Parser {
  configuration: ConfigurationType;

  constructor(configuration: ConfigurationType) {
    this.configuration = configuration;
  }

  get connectionUrl() {
    return this.configuration.connectionUrl;
  }

  verifyConfiguration() {
    const { connectionUrl } = this.configuration;
    if (!connectionUrl) {
      gracefulShutdown('connectionUrl is missing');
    }
  }

  getTransformer(table: string, col: string): Transformer {
    /*
    Table specific column transformers are given higher precedence
    */
    const { tables, columns, defaultTransformer } = this.configuration;

    if (this.isColumnMarkedInTable(table, col)) {
      return tables[table][col];
    }

    if (this.isColumnMarked(col)) {
      return columns[col];
    }

    return defaultTransformer;
  }

  applyTransform(value: string, table: string, column: string) {
    const transformer = this.getTransformer(table, column);

    if (transformer) {
      return transformer(value);
    }

    return value;
  }

  isTableMarked(table: string) {
    const { tables } = this.configuration;
    return table in tables;
  }

  isColumnMarked(column: string) {
    const { columns } = this.configuration;
    return column in columns;
  }

  isColumnMarkedInTable(table: string, column: string) {
    const { tables } = this.configuration;
    return this.isTableMarked(table) ? column in tables[table] : false;
  }
}

export { Parser };
