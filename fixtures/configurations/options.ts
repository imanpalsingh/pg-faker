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

export const optionsConfiguration = {
  raw: {
    tables,
    options,
  },

  parsed: tablesParsed,
};
