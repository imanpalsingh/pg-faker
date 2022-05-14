import { Query } from './abstracts/query.js';

class AlterSequence extends Query {
  constructor() {
    super();
    this.regex = /^ALTER SEQUENCE .* OWNED BY .*\.(.*)\..*;/;
  }
}

export { AlterSequence };
export default new AlterSequence();
