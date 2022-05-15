import { InfraQuery } from './abstracts/infra-query.js';

class Select extends InfraQuery {
  constructor() {
    super()
    this.regex = /SELECT pg_.*;/
  }
}

export { Select }
export default new Select();
