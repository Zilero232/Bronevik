import type { SessionListItem } from '@bronevik/schemas';

export type SessionCardProps = {
  nickname: string;
  session: SessionListItem | null | undefined;
};
