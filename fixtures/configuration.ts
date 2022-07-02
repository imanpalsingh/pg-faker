export const sampleTransformers = {
  commonName: (val: any) => val,
  password: (val: any) => val,
  email: (val: any) => val,
  specificName: (val: any) => `${val}over`,
};

export const configurationData = {
  raw: {
    connectionUrl: 'postgres://somewhere',
    columns: {
      name: sampleTransformers.commonName,
      password: sampleTransformers.password,
    },

    tables: {
      users: {
        email: sampleTransformers.email,
        name: sampleTransformers.specificName,
      },
    },
  },

  correctParsed: {
    users: {
      name: sampleTransformers.specificName,
      password: sampleTransformers.password,
      email: sampleTransformers.email,
    },
  },

  incorrectParsed: {
    users: {
      name: sampleTransformers.commonName,
      password: sampleTransformers.password,
      email: sampleTransformers.email,
    },
  },
};
