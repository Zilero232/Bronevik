import type { DamageLogData } from '../../model/schemas';
import type { DamageLogView } from './damage-log-view.types';

import { formatNumber } from '../../../../../shared/lib/hud-format';

export const damageLogView = (data: DamageLogData): DamageLogView => ({
  compact: data.style === 'compact',
  totals: data.totals.map((total) => ({ key: total.key, icon: total.icon, value: formatNumber(total.value), tone: total.tone })),
  rows: data.rows.map((row, key) => ({ ...row, key, text: formatNumber(row.received ? -row.amount : row.amount) }))
});
