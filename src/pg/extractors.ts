import alterSequence from './queries/alter-sequence.js';
import alterTable from './queries/alter-table.js';
import alterTableSequence from './queries/alter-table-sequence.js';
import copy from './queries/copy.js';
import createSequence from './queries/create-sequence.js';
import createTable from './queries/create-table.js';
import { Query } from './queries/abstracts/query.js';
import sequenceSet from './queries/sequence-set.js';
import setQ from './queries/set-q.js';
import select from './queries/select.js';

class PgExtractor {

  static queries = [alterSequence, alterTableSequence, alterTable, copy, createSequence, createTable, sequenceSet, setQ, select];

  static parseLine(line: string): Query | null {
    const queryObj = this.queries.find((query) => query.match(line));
    if (queryObj) {
      queryObj.query = line;
      return queryObj;
    }
    return null;
  }

  static isAComment(line: string) {
    return line.match(/--.*/g);
  }
}

export { PgExtractor };
