export const listParam = <T>(values: readonly T[] | undefined): T[] | undefined => (values?.length ? [...values] : undefined);
