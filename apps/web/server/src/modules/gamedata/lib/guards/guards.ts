export const oneOf = <T extends string>(values: readonly T[]): ((value: string | undefined) => value is T) => {
  const allowed = new Set<string | undefined>(values);

  return (value): value is T => allowed.has(value);
};
