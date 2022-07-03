import {ConfigurationType} from '../../types/domain';
import {columnConfiguration} from './columns';
import {optionsConfiguration} from './options';

export function completeConfiguration() {
  const {raw: columnRaw} = columnConfiguration();
  const {raw: optionsRaw, parsed: optionsParsed} = optionsConfiguration();
  const configurationRaw: ConfigurationType = {
    connectionUrl: 'postgres://somewhere',

    columns: columnRaw.columns,
    tables: {
      users: columnRaw.tables.users,
      comments: optionsRaw.tables.comments,
    },
    options: optionsRaw.options,
  };

  const expectedTables = {
    users: optionsParsed.users,
    comments: {...columnRaw.columns, ...configurationRaw.tables?.comments},
    posts: optionsParsed.posts,
  };

  const configurationParsed = {
    aoo: {...expectedTables},
    flags: {optimizeQuerySearch: false},
  };

  return {
    raw: configurationRaw,
    parsed: configurationParsed,
  };
}
