import {CreateTable} from '../create-table';

describe('Create table', () => {
  const table = 'users';
  const query = `CREATE TABLE public.${table} (`;

  it('Identifies correct queries', () => {
    const matcher = new CreateTable();
    expect(matcher.match(query)).not.toHaveLength(0);
  });

  it('It has correct table name', () => {
    const matcher = new CreateTable();
    matcher.query = query;
    expect(matcher.tableName).toBe(table);
  });
});
