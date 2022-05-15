import {DataQuery} from './abstracts/data-query.js';

class Copy extends DataQuery {
  constructor() {
    super();
    this.regex = /^COPY .*\.(.*?) .*$$/;
    this.columnRegex = /^COPY (?:.*?) \((.*)\).*$/;
  }
}
export {Copy};
export default new Copy();
