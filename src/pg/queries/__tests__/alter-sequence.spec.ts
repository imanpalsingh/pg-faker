import {AlterSequence} from '../alter-sequence';

describe('Alter sequence', () => {
  const table = 'users';
  const query = `ALTER SEQUENCE public.${table}_id_seq OWNED BY public.${table}.id;`;

  it('Identifies correct queries', () => {
    const matcher = new AlterSequence();
    expect(matcher.match(query)).not.toHaveLength(0);
  });

  it('It has correct table name', () => {
    const matcher = new AlterSequence();
    matcher.query = query;
    expect(matcher.tableName).toBe(table);
  });
});
