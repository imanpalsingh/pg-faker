import { Query } from './query.js';

class InfraQuery extends Query {
  constructor() {
    super();
    if (this.constructor === InfraQuery) {
      throw new Error("Abstract class InfraQuery need can't be instantiated.");
    }
  }

  get tableName() {
    return '';
  }
}

export { InfraQuery };
