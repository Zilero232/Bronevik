import type { HitLogRow } from '../../model/schemas';

export type HitLogRowView = HitLogRow & { key: number; damageText: string; hitsText: string; hpText: string; hasBar: boolean };

export type HitLogView = { header: { hits: string; pens: string; damage: string } | null; rows: HitLogRowView[] };
