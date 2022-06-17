import {Copy} from '../copy';

describe('Copy', () => {
  const table = 'users';
  const columns = ['id', 'name', 'password', 'email'];
  const columnsStr = columns.reduce((prev, current) => `${prev}, ${current}`);
  const query = `COPY public.${table} (${columnsStr}) FROM stdin; `;

  it('Identifies correct queries', () => {
    const matcher = new Copy();
    expect(matcher.match(query)).not.toHaveLength(0);
  });

  it('It has correct table name and columns', () => {
    const matcher = new Copy();
    matcher.query = query;
    expect(matcher.tableName).toBe(table);
    expect(matcher.columns).toStrictEqual(columns);
  });
});
