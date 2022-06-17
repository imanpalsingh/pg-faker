class Query {
  regex!: RegExp;

  query!: string;

  hasData!: boolean;

  constructor() {
    if (this.constructor === Query) {
      throw new Error('Abstract class Query need can\'t be instantiated.');
    }
  }

  get tableName() {
    return this.query.replace(this.regex, '$1');
  }

  match(query: string) {
    return query.match(this.regex);
  }
}

export {Query};
