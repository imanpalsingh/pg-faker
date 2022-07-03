const columnsConfiguration = {
  columns: {
    name: (val: string) => `The ${val}`,
    email: (val: string) => `subdomain.${val}`,
  },
};

const columnConfigurationWithTableRaw = {
  columns: columnsConfiguration.columns,
  tables: {
    users: {
      name: (val: string) => `A ${val}`,
      phone: (val: string) => `+91${val}`,
    },
  },
};

const columnConfigurationWithTableParsed = {
  users: {
    name: columnConfigurationWithTableRaw.tables.users.name,
    phone: columnConfigurationWithTableRaw.tables.users.phone,
    email: columnsConfiguration.columns.email,
  },
};

export const columnConfiguration = {
  raw: columnConfigurationWithTableRaw,
  parsed: columnConfigurationWithTableParsed,
};
