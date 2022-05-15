import { InfraQuery } from './abstracts/infra-query.js';

class SetQ extends InfraQuery {
  constructor() {
    super();
    this.regex = /SET.*;$/
  }
}

export { SetQ };
export default new SetQ();
