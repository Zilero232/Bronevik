import type { DamageLogData, DamageLogRow } from '../../model/schemas';
import type { DamageLogView } from './damage-log-view.types';

import { formatNumber } from '../../../../../shared/lib/hud-format';

const shortRow = (row: DamageLogRow): DamageLogRow => ({ ...row, cls: null, name: '', source: null, ammo_rack: null });

export const damageLogView = (data: DamageLogData): DamageLogView => {
  const rows = data.detail === 'short' ? data.rows.map(shortRow) : data.rows;

  return {
    compact: data.style === 'compact',
    totals: data.totals.map((total) => ({ key: total.key, icon: total.icon, value: formatNumber(total.value), tone: total.tone })),
    rows: rows.map((row, key) => ({ ...row, key, text: formatNumber(row.received ? -row.amount : row.amount) }))
  };
};
