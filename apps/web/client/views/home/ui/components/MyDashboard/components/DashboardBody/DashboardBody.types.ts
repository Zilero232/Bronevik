import type { PlayerMarks, PlayerProfile, SessionListItem, StatsBlock } from '@otmetki/schemas';

import type { ClosestMark } from '@/entities/player/marks';

export type DashboardBodyProps = {
  nickname: string;
  profile: PlayerProfile;
  week: StatsBlock | null;
  session: SessionListItem | null | undefined;
  marks: { summary: PlayerMarks['summary']; closest: ClosestMark[] } | undefined;
  onForget: () => void;
};
