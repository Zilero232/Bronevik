import slugifyText from '@sindresorhus/slugify';

export const slugify = (value: string): string => slugifyText(value, { decamelize: false });
