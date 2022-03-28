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

  getTransformer(col: string): Transformer {
    /*
    Table specific column transformers are given higher precedence
    */

    const { tables, columns, defaultTransformer } = this.configuration;

    const [specificTransformer] = Object.values(tables).filter((table) => col in table);

    if (specificTransformer) {
      return specificTransformer[col as keyof typeof specificTransformer] as Transformer;
    }

    if (col in columns) {
      return columns[col];
    }

    return defaultTransformer;
  }

  applyTransform(value: string, table: string, column: string) {
    const { defaultTransformer } = this.configuration;
    if (this.shouldTransform(table, column)) {
      const transformer = this.getTransformer((column));
      const changed = transformer(value);
      return changed;
    }

    if (!(defaultTransformer === null || defaultTransformer === undefined)) {
      return defaultTransformer(value);
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

  isColumnMarkedInTable(column: string) {
    const { tables } = this.configuration;
    return Object.values(tables).some((table) => column in table);
  }

  shouldTransform(table: string, column: string) {
    if (this.isColumnMarked(column) || this.isColumnMarkedInTable(column)) {
      return true;
    }
    return false;
  }
}

export { Parser };
