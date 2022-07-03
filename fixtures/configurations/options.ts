export function optionsConfiguration() {
  const tables = {
    users: {
      name: (val: string) => `The ${val}`,
    },

    comments: {
      title: (val: string) => `The ${val}`,
      author: (val: string) => val,
    },
  };

  const options = {
    skip: {
      posts: 'output' as const,
      users: 'mask' as const,
    },
  };

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
