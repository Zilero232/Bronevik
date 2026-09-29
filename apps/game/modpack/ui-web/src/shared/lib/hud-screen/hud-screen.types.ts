import type { ClientSize } from '../../api/gameface';

export type DesignScreenInput = { client: ClientSize | null; scale: number; fallback: ClientSize };
