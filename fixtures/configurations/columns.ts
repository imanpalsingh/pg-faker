export function columnConfiguration() {
  return {
    name: (val: string) => `The ${val}`,
    email: (val: string) => `subdomain.${val}`,
  };
}
