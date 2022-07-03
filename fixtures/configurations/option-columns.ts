import {columnConfiguration} from './columns';

const configuration = {
  columns: columnConfiguration.raw.columns,
  tables: {
    ...columnConfiguration.raw.tables,
    posts: 'SKIP:OUTPUT' as const,
    users: 'SKIP:MASK' as const,
  },
};

const configurationParsed = {
  ...columnConfiguration.parsed,
  posts: 'SKIP:OUTPUT' as const,
  users: 'SKIP:MASK' as const,
};

export const optionsColumnsConfiguration = {
  raw: configuration,
  parsed: configurationParsed,
};
