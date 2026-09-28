import type { OfficialTopEntry } from '@otmetki/schemas';

export type OfficialEntryLink = {
  href: string;
  label: string;
};

export type OfficialEntryInput = Pick<OfficialTopEntry, 'accountId' | 'nickname'>;
