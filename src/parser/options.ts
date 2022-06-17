import {OptionsType} from '../../types/domain.js';

class Options {
  options?: OptionsType;

  constructor(options?: OptionsType) {
    this.options = options;
  }

  shouldSkipTable(table: string, condition: string) {
    if (!this.options) return false;

    const {skip} = this.options;

    if (table in skip) {
      return skip[table] === condition;
    }

    return false;
  }

  shouldSkipTableForMasking(table: string) {
    return this.shouldSkipTable(table, 'mask');
  }

  shouldSkipTableForOutput(table: string) {
    return this.shouldSkipTable(table, 'output');
  }
}

export {Options};
