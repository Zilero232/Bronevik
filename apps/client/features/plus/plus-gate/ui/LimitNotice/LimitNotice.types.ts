import type { PlusCountKey } from '@otmetki/schemas';

export type LimitNoticeProps = {
  limitKey: PlusCountKey;
  used: number;
  className?: string;
};
