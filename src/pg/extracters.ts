class PgExtractors {
  line: string;

  constructor(line: string) {
    this.line = line;
  }

  isCopyQuery() {
    return this.line.match(/^COPY .* FROM stdin;$/);
  }

  getTableName() {
    return this.line.replace(/^COPY .*\.(.*?) .*$$/, '$1');
  }

  getCols() {
    return this.line
      .replace(/^COPY (?:.*?) \((.*)\).*$/, '$1')
      .split(',')
      .map((e) => e.trim())
      .map((e) => e.replace(/"/g, ''))
      .map((e) => e.toLowerCase());
  }
}

export { PgExtractors };
