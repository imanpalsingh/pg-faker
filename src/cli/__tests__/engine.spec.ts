import {CreateTable} from '../../pg/queries/create-table';
import {SetQ} from '../../pg/queries/set-q';
import {Logger} from '../../utils/logger';
import {Engine} from '../engine';

describe('Engine', () => {
  it('skips masking for correct tables', () => {
    const engine = new Engine();

    engine.aoo = {
      tables: {
        users: 'SKIP:MASK',
      },
    };

    expect(engine.shouldSkipMasking('users')).toBeTruthy();
  });

  it('does not skip masking for incorrect tables', () => {
    const engine = new Engine();

    engine.aoo = {
      tables: {
        users: 'SKIP:MASK',
      },
    };

    expect(engine.shouldSkipMasking('orders')).toBeFalsy();
  });

  it('skips output for correct tables', () => {
    const engine = new Engine();

    engine.aoo = {
      tables: {
        users: 'SKIP:OUTPUT',
      },
    };

    expect(engine.shouldSkipOutput('users')).toBeTruthy();
  });

  it('does not skip output for incorrect tables', () => {
    const engine = new Engine();

    engine.aoo = {
      tables: {
        users: 'SKIP:OUTPUT',
      },
    };

    expect(engine.shouldSkipOutput('orders')).toBeFalsy();
  });

  it('identifies line that is marked as a comment', () => {
    const engine = new Engine();

    const commentLine = '-- this is select query';
    const queryLine = 'Select * from Users';

    expect(engine.isAComment(commentLine)).toBeTruthy();
    expect(engine.isAComment(queryLine)).toBeFalsy();
  });

  it('identifies a line correctly', () => {
    const engine = new Engine();

    const queryLine = `CREATE TABLE public.users_details (`;
    const randomLine = `user_id integer,`;
    const dataLine = `4577412004`;

    expect(engine.parseLine(queryLine)).not.toBeNull();
    expect(engine.parseLine(randomLine)).toBeNull();
    expect(engine.parseLine(dataLine)).toBeNull();
  });

  it('executes InfraQuery without checking the condition', () => {
    const engine = new Engine();

    const query = new SetQ();
    query.query = 'SET statement_timeout = 0;';

    expect(engine.canExecute(query)).toBeTruthy();
  });

  it('determines if query can be executed', () => {
    const engine = new Engine();

    engine.aoo = {
      tables: {
        users: 'SKIP:OUTPUT',
      },
    };

    engine.logger = new Logger('verbose');

    const queryToBeSkipped = new CreateTable();
    queryToBeSkipped.query = 'CREATE TABLE public.users (';

    expect(engine.canExecute(queryToBeSkipped)).toBeFalsy();

    const queryToBeExecuted = new CreateTable();
    queryToBeExecuted.query = 'CREATE TABLE public.orders (';

    expect(engine.canExecute(queryToBeExecuted)).toBeTruthy();
  });

  it('returns correct transformers for a table', () => {
    const engine = new Engine();

    engine.aoo = {
      tables: {},
    };

    engine.cache ={
      tableName: 'users',
      columns: ['name', 'description', 'id'],
    };

    const operators = {
      name: ()=>{},
      description: ()=>{},
    };

    const result = engine.requiredTransformers(operators);

    expect(result!.name).toEqual(operators.name);
    expect(result!.description).toEqual(operators.description);
    expect(result!.id).toBeUndefined();
  });

  it('returns null if no transformers are defined', () => {
    const engine = new Engine();

    engine.aoo = {
      tables: {},
    };

    engine.cache ={
      tableName: 'users',
      columns: ['name', 'description', 'id'],
    };

    const operators = {};

    const result = engine.requiredTransformers(operators);

    expect(result).toBeNull();
  });
});
