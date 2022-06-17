import {Query} from './abstracts/query.js';

class CreateIndex extends Query {
  constructor() {
    super();
    this.regex = /^CREATE .*INDEX.*ON.*\.(.*?) .*/;
  }
}

export {CreateIndex};
export default new CreateIndex();
