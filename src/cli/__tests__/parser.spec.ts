import {
  configWithUrl,
  emptyAOO,
  minimalConfiguration,
} from '../../../fixtures/configurations/basic';
import {columnConfiguration} from '../../../fixtures/configurations/columns';
import {completeConfiguration} from '../../../fixtures/configurations/complete';
import {optionConfiguration, optionParsed} from '../../../fixtures/configurations/options';
import {tableConfiguration} from '../../../fixtures/configurations/tables';
import {optionCompleteConfiguration} from '../../../fixtures/configurations/options-complete';
import {AbstractOperationType, ConfigurationType} from '../../../types/domain';
import {Parser} from '../parser';

describe('Parser', () => {
  it('exits the process if connectionUrl is missing', () => {
    const mockExit = jest.spyOn(process, 'exit').mockImplementation(() => undefined as never);
    const parser = new Parser();
    parser.parse(minimalConfiguration());
    expect(mockExit).toBeCalled();
  });

  it('returns empty abstraction object if no  rule are defined in configuration ', () => {
    const parser = new Parser();
    const aoo = parser.parse(configWithUrl());
    expect(aoo).toEqual(emptyAOO());
  });

  it('returns correct abstraction object if only options are defined ', () => {
    const parser = new Parser();
    const configuration: ConfigurationType = {
      ...configWithUrl(),
      options: {...optionConfiguration()},
    };
    const expectedAoo: AbstractOperationType = {
      aoo: {tables: optionParsed()},
      flags: {
        optimizeQuerySearch: false,
      },
    };

    const aoo = parser.parse(configuration);

    expect(aoo).toEqual(expectedAoo);
  });

  it('returns correct abstraction object if only columns are defined ', () => {
    const parser = new Parser();
    const configuration: ConfigurationType = {
      ...configWithUrl(),
      columns: columnConfiguration(),
    };
    const expectedAoo: AbstractOperationType = {
      aoo: {columns: configuration.columns},
      flags: {
        optimizeQuerySearch: true,
      },
    };

    const aoo = parser.parse(configuration);

    expect(aoo).toEqual(expectedAoo);
  });

  it('returns correct abstraction object if only tables are defined ', () => {
    const parser = new Parser();
    const configuration: ConfigurationType = {
      ...configWithUrl(),
      tables: tableConfiguration(),
    };
    const expectedAoo: AbstractOperationType = {
      aoo: {tables: configuration.tables},
      flags: {
        optimizeQuerySearch: true,
      },
    };

    const aoo = parser.parse(configuration);

    expect(aoo).toEqual(expectedAoo);
  });

  it('parses options correctly', () => {
    const parser = new Parser();
    const {raw, parsed} = optionCompleteConfiguration();
    const {tables, options} = raw;

    const parsedTables = parser.parseOptions(tables, options);

    expect(parsedTables).toEqual(parsed);
  });

  it('generates correct abstract operation object', () => {
    const parser = new Parser();
    const {raw, parsed} = completeConfiguration();
    const parsedConfiguration = parser.parse(raw);
    expect(parsedConfiguration).toEqual(parsed);
  });
});