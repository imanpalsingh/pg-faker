import { Query } from './abstracts/query.js';

class CreateTable extends Query {
  constructor() {
    super();
    this.regex = /^CREATE TABLE .*\.(.*) \(/;
  }
}

export { CreateTable };
export default new CreateTable();
