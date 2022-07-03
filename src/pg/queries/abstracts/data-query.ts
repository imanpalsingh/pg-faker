import {Query} from './query.js';

class DataQuery extends Query {
  columnRegex!: RegExp;

  constructor() {
    super();
    if (this.constructor === DataQuery) {
      throw new Error(`Abstract class DataQuery need can\'t be instantiated.`);
    }
  }

  get columns() {
    return this.query
      .replace(this.columnRegex, '$1')
      .split(',')
      .map((e) => e.trim())
      .map((e) => e.replace(/"/g, ''))
      .map((e) => e.toLowerCase());
  }
}

export {DataQuery};
