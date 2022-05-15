import {SequenceSet} from '../sequence-set';

describe('Sequence set', () => {
  const table = 'users';
  const query = `SELECT pg_catalog.setval('public.${table}_id_seq', 1, false);`;

  it('Identifies correct queries', () => {
    const matcher = new SequenceSet();
    expect(matcher.match(query)).not.toHaveLength(0);
  });

  it('It has correct table name', () => {
    const matcher = new SequenceSet();
    matcher.query = query;
    expect(matcher.tableName).toBe(table);
  });
});
