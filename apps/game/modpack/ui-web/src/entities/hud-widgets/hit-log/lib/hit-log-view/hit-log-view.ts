import type { HitLogData } from '../../model/schemas';
import type { HitLogView } from './hit-log-view.types';

import { formatNumber } from '../../../../../shared/lib/hud-format';

export const hitLogView = (data: HitLogData): HitLogView => ({
  header: data.header
    ? { hits: formatNumber(data.header.hits), pens: formatNumber(data.header.pens), damage: formatNumber(data.header.damage) }
    : null,
  rows: data.rows.map((row, key) => ({
    ...row,
    key,
    damageText: row.damage === null ? '' : formatNumber(row.damage),
    hitsText: data.grouped && row.hits > 1 ? `×${row.hits}` : '',
    hpText: row.hp === null ? '' : formatNumber(row.hp),
    hasBar: row.hp !== null && row.max !== null
  }))
});
