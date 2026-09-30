import type { PlayerSummary } from '@otmetki/schemas';

export type DashboardHeadProps = {
  summary: PlayerSummary;
  onForget: () => void;
};
