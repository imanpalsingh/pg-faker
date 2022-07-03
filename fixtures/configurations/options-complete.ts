import {optionConfiguration} from './options';
import {tableConfiguration} from './tables';

export function optionCompleteConfiguration() {
  const tables = tableConfiguration();
  const options = optionConfiguration();

  const tablesParsed = {
    users: 'SKIP:MASK' as const,
    comments: tables.comments,
    posts: 'SKIP:OUTPUT' as const,
  };
  return {
    raw: {
      tables,
      options,
    },

    parsed: tablesParsed,
  };
}
