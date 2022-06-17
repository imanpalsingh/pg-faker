import {Query} from './abstracts/query.js';

class CreateSequence extends Query {
  constructor() {
    super();
    this.regex = /^CREATE SEQUENCE .*\.(.*?)_id_seq/;
  }
}

export {CreateSequence};
export default new CreateSequence();
