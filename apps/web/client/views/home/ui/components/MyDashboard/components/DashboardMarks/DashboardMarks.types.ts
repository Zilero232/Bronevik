import type { PlayerMarks } from '@otmetki/schemas';

import type { ClosestMark } from '@/entities/player/marks';

export type DashboardMarksProps = {
  nickname: string;
  marks: { summary: PlayerMarks['summary']; closest: ClosestMark[] } | undefined;
};
