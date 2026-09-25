import type { MasteryThreshold, MoeRow } from '@bronevik/schemas';

export type MoeDrawerProps = {
  row: MoeRow | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export type MoeHistoryChartProps = {
  tankId: number;
};

export type MasteryLadderProps = {
  mastery: MasteryThreshold | null;
};
