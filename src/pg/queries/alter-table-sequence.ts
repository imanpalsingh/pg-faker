import { Query } from './abstracts/query.js';

class AlterTableSequence extends Query {
  constructor() {
    super();
    this.regex = /^ALTER TABLE .*\.(.*)_id_seq .*;/;
  }
}

export { AlterTableSequence };
export default new AlterTableSequence();
