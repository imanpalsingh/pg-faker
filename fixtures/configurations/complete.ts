import {ConfigurationType} from '../../types/domain';
import {columnConfiguration} from './columns';
import {optionsConfiguration} from './options';

const configurationRaw: ConfigurationType = {
  connectionUrl: 'postgres://somewhere',

  columns: columnConfiguration.raw.columns,
  tables: {
    users: columnConfiguration.raw.tables.users,
    comments: optionsConfiguration.raw.tables.comments,
  },
  options: optionsConfiguration.raw.options,
};

const expectedTables = {
  users: optionsConfiguration.parsed.users,
  comments: {...columnConfiguration.raw.columns, ...configurationRaw.tables?.comments},
  posts: optionsConfiguration.parsed.posts,
};

const configurationParsed = {
  aoo: {...expectedTables},
  flags: {optimizeQuerySearch: false},
};

export const completeConfiguration = {
  raw: configurationRaw,
  parsed: configurationParsed,
};
