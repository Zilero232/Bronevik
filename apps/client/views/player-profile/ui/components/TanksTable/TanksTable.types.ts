import type { PlayerTankRow } from '@otmetki/schemas';

export type TanksTableProps = {
  rows: PlayerTankRow[];
  isLoading: boolean;
  onReset: () => void;
};
