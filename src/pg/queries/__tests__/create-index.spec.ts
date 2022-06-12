import {CreateIndex} from '../create-index.js';

describe('Create Index', () => {
  const table = 'users';
  const query = `CREATE INDEX index_${table}_on_id ON public.${table} USING btree (id);`;
  const uniqueQuery = `CREATE INDEX index_${table}_on_id ON public.${table} USING btree (id);`;

  it('Identifies correct queries', () => {
    const matcher = new CreateIndex();
    expect(matcher.match(query)).not.toHaveLength(0);
    expect(matcher.match(uniqueQuery)).not.toHaveLength(0);
  });

  it('It has correct table name for noraml query', () => {
    const matcher = new CreateIndex();
    matcher.query = query;
    expect(matcher.tableName).toBe(table);
  });

  it('It has correct table name for unique query', () => {
    const matcher = new CreateIndex();
    matcher.query = uniqueQuery;
    expect(matcher.tableName).toBe(table);
  });
});
