import {CreateSequence} from '../create-sequence';

describe('Create sequence', () => {
  const table = 'users';
  const query = `CREATE SEQUENCE public.${table}_id_seq`;

  it('Identifies correct queries', () => {
    const matcher = new CreateSequence();
    expect(matcher.match(query)).not.toHaveLength(0);
  });

  it('It has correct table name', () => {
    const matcher = new CreateSequence();
    matcher.query = query;
    expect(matcher.tableName).toBe(table);
  });
});
