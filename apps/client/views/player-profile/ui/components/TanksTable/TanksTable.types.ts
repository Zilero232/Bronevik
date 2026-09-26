import type { PlayerTankRow } from '@bronevik/schemas';

export type TanksTableProps = {
  rows: PlayerTankRow[];
  isLoading: boolean;
  onReset: () => void;
};
