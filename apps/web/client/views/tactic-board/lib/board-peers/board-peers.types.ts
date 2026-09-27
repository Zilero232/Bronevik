import type { BoardPoint } from '../board-geometry';

export type BoardPeer = {
  clientId: number;
  name: string | null;
  color: string;
  cursor: BoardPoint | null;
};

export type BoardPeersInput = {
  states: ReadonlyMap<number, Record<string, unknown>>;
  selfId: number;
};
