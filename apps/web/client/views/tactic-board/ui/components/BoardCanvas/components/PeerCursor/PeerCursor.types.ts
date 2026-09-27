import type { BoardPoint } from '../../../../../lib/board-geometry';

export type PeerCursorProps = {
  name: string | null;
  color: string;
  cursor: BoardPoint;
  scale: number;
};
