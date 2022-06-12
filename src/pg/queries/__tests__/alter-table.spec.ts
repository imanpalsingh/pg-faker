import {AlterTable} from '../alter-table';

describe('Alter table', () => {
  const table = 'users';
  const query = `ALTER TABLE public.${table} OWNER TO PGFAKER;`;
  const onlyQuery = `ALTER TABLE ONLY public.${table}`;
  const nestedQuery = `${onlyQuery} ALTER COLUMN id SET DEFAULT nextval('public.${table}_id_seq'::regclass);`;

  it('Identifies correct queries', () => {
    const matcher = new AlterTable();
    expect(matcher.match(query)).not.toHaveLength(0);
    expect(matcher.match(onlyQuery)).not.toHaveLength(0);
  });

  it('It has correct table name for normal query', () => {
    const matcher = new AlterTable();
    matcher.query = query;
    expect(matcher.tableName).toBe(table);
  });

  it('It has correct table name for ONLY query', () => {
    const matcher = new AlterTable();
    matcher.query = onlyQuery;
    expect(matcher.tableName).toBe(table);
  });

  it('It has correct table name for nested query', () => {
    const matcher = new AlterTable();
    matcher.query = nestedQuery;
    expect(matcher.tableName).toBe(table);
  });
});
