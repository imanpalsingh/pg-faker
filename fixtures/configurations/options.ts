export function optionConfiguration() {
  return {
    skip: {
      posts: 'output' as const,
      users: 'mask' as const,
    },
  };
}

export function optionParsed() {
  return {
    posts: 'SKIP:OUTPUT' as const,
    users: 'SKIP:MASK' as const,
  };
}
