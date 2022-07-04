export function tableConfiguration() {
  return {
    users: {
      name: (val: string) => `A ${val}`,
      phone: (val: string) => `+91${val}`,
    },
    comments: {
      title: (val: string) => `The ${val}`,
      author: (val: string) => val,
    },
  };
}
