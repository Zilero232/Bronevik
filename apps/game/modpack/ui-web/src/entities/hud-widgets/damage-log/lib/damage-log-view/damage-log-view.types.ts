import type { DamageLogRow } from '../../model/schemas';

export type DamageLogRowView = DamageLogRow & { key: number; text: string };

export type DamageLogTotalView = { key: string; icon: string | null; value: string; tone: DamageLogRow['tone'] };

export type DamageLogView = { compact: boolean; totals: DamageLogTotalView[]; rows: DamageLogRowView[] };
