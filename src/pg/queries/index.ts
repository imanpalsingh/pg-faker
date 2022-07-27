/*
    Register the queries here.
    If the regex are not specific enough, then the order of the queries will matter
*/

import alterSequence from './alter-sequence.js';
import alterTable from './alter-table.js';
import alterTableSequence from './alter-table-sequence.js';
import copy from './copy.js';
import createSequence from './create-sequence.js';
import createTable from './create-table.js';
import sequenceSet from './sequence-set.js';
import setQ from './set-q.js';
import select from './select.js';
import createIndex from './create-index.js';

export const indexOnQueries = {
  SET: [setQ],
  SELECT: [sequenceSet, select],
  CREATE: [createSequence, createTable, createIndex],
  ALTER: [alterSequence, alterTableSequence, alterTable],
  COPY: [copy],
};
