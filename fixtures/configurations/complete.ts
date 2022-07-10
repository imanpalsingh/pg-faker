import {AbstractOperationType, ConfigurationType} from '../../types/domain';
import {columnConfiguration} from './columns';
import {optionConfiguration} from './options';
import {tableConfiguration} from './tables';

export function completeConfiguration() {
  const columns = columnConfiguration();
  const options = optionConfiguration();
  const tables = tableConfiguration();

  const configurationRaw: ConfigurationType = {
    connectionUrl: 'postgres://somewhere',
    columns,
    tables,
    options,
  };

  const expectedAoo: AbstractOperationType['aoo'] = {
    tables: {
      ...configurationRaw.tables,
      posts: 'SKIP:OUTPUT',
      users: 'SKIP:MASK',
    },
    columns: configurationRaw.columns,
  };

  const configurationParsed = {
    aoo: expectedAoo,
  };

  return {
    raw: configurationRaw,
    parsed: configurationParsed,
  };
}
