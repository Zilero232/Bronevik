import type { SessionListItem } from '@otmetki/schemas';

export type SessionCardProps = {
  nickname: string;
  session: SessionListItem | null | undefined;
};
