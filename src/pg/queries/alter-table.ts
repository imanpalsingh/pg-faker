import {Query} from './abstracts/query.js';

class AlterTable extends Query {
  constructor() {
    super();
    this.regex = /^ALTER TABLE .*\.(.*?) .*;/;
  }
}

export {AlterTable};
export default new AlterTable();
