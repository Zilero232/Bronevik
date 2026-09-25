import { LIST_SEPARATOR } from '@bronevik/schemas';

export const joinList = (values: readonly (number | string)[] | undefined) => (values?.length ? values.join(LIST_SEPARATOR) : undefined);
