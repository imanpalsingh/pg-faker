import {Query} from './abstracts/query.js';

class SequenceSet extends Query {
  constructor() {
    super();
    this.regex = /^SELECT .*\.setval\('.*\.(.*)_id_seq'.*;/;
  }
}

export {SequenceSet};
export default new SequenceSet();
