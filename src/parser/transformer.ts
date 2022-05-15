import {
  TransformerProps, TransformerType,
} from '../../types/domain.js';
import {Options} from './options.js';

class Transformer {
  props: TransformerProps;

  options: Options;

  constructor(props: TransformerProps) {
    this.props = props;
    this.options = new Options(this.props.options);
  }

  getFor(table: string, col: string): TransformerType | undefined {
    if (this.isColumnMarkedInTable(table, col)) {
      return this.props.tables![table][col];
    }

    if (this.isColumnMarked(col)) {
      return this.props.columns![col];
    }

    return this.props.defaultTransformer;
  }

  isTableMarked(table: string) {
    const {tables} = this.props;
    if (!tables) return false;

    return table in tables;
  }

  isColumnMarked(column: string) {
    const {columns} = this.props;
    if (!columns) return false;

    return column in columns;
  }

  isColumnMarkedInTable(table: string, column: string) {
    const {tables} = this.props;
    if (!tables) return false;
    return this.isTableMarked(table) ? column in tables[table] : false;
  }

  applyTransform(value: string, table: string, column: string) {
    if (this.options.shouldSkipTableForMasking(table)) return value;

    const transformer = this.getFor(table, column);

    if (transformer) {
      return transformer(value);
    }

    return value;
  }
}

export {Transformer};
