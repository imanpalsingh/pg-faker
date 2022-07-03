import {minimalConfiguration} from '../../../fixtures/configurations/basic';
import {columnConfiguration} from '../../../fixtures/configurations/columns';
import {completeConfiguration} from '../../../fixtures/configurations/complete';
import {optionsColumnsConfiguration} from '../../../fixtures/configurations/option-columns';
import {optionsConfiguration} from '../../../fixtures/configurations/options';
import {Parser} from '../parser';

describe('Parser', () => {
  it('exits the process if connectionUrl is missing', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const parser = new Parser();
    parser.parse(minimalConfiguration());
    expect(mockExit).toBeCalled();
  });

  it('parses options correctly', () => {
    const parser = new Parser();
    const {raw, parsed} = optionsConfiguration();
    const {tables, options} = raw;

    const parsedTables = parser.parseOptions(tables, options);

    expect(parsedTables).toEqual(parsed);
  });

  describe('for columns', () => {
    it('parses raw configuration correctly', () => {
      const parser = new Parser();
      const {raw, parsed} = columnConfiguration();
      const parsedTables = parser.parseColumns(raw.tables, raw.columns);
      expect(parsedTables).toEqual(parsed);
    });

    it('parses parsed option configuration correctly', () => {
      const parser = new Parser();
      const {raw, parsed} = optionsColumnsConfiguration();
      const parsedTables = parser.parseColumns(raw.tables, raw.columns);
      expect(parsedTables).toEqual(parsed);
    });
  });

  it('generates correct abstract operation object', () => {
    const parser = new Parser();
    const {raw, parsed} = completeConfiguration();
    const parsedConfiguration = parser.parse(raw);
    expect(parsedConfiguration).toEqual(parsed);
  });
});
