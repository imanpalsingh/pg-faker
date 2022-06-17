import {AlterTableSequence} from '../alter-table-sequence';


describe('Alter table sequence', () => {
  const table = 'users';
  const query = `ALTER TABLE public.${table}_id_seq OWNER TO PGFAKER;`;

  it('Identifies correct queries', () => {
    const matcher = new AlterTableSequence();
    expect(matcher.match(query)).not.toHaveLength(0);
  });

  it('It has correct table name', () => {
    const matcher = new AlterTableSequence();
    matcher.query = query;
    expect(matcher.tableName).toBe(table);
  });
});
