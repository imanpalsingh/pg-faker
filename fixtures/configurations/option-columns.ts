import {columnConfiguration} from './columns';

export function optionsColumnsConfiguration() {
  const {raw, parsed} = columnConfiguration();
  const configuration = {
    columns: raw.columns,
    tables: {
      ...raw.tables,
      posts: 'SKIP:OUTPUT' as const,
      users: 'SKIP:MASK' as const,
    },
  };

  const configurationParsed = {
    ...parsed,
    posts: 'SKIP:OUTPUT' as const,
    users: 'SKIP:MASK' as const,
  };

  return {
    raw: configuration,
    parsed: configurationParsed,
  };
}
