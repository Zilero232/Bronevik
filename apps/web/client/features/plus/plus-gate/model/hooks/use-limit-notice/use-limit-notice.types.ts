import type { PlusCountKey } from '@otmetki/schemas';

export type UseLimitNoticeInput = {
  limitKey: PlusCountKey;
  used: number;
};
