import type { SessionListItem } from '@otmetki/schemas';

export type DashboardSessionProps = {
  nickname: string;
  session: SessionListItem | null | undefined;
};
