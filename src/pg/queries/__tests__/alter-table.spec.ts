import {AlterTable} from '../alter-table';


describe('Alter table', () => {
  const table = 'users';
  const query = `ALTER TABLE public.${table} OWNER TO PGFAKER;`;

  it('Identifies correct queries', () => {
    const matcher = new AlterTable();
    expect(matcher.match(query)).not.toHaveLength(0);
  });

  it('It has correct table name', () => {
    const matcher = new AlterTable();
    matcher.query = query;
    expect(matcher.tableName).toBe(table);
  });
});
