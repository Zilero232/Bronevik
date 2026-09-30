import type { HitLogData, HitLogRow } from '../../model/schemas';
import type { HitLogView } from './hit-log-view.types';

import { formatNumber } from '../../../../../shared/lib/hud-format';

const shortRow = (row: HitLogRow): HitLogRow => ({ ...row, cls: null, hp: null });

export const hitLogView = (data: HitLogData): HitLogView => {
  const rows = data.detail === 'short' ? data.rows.map(shortRow) : data.rows;

  return {
    header: data.header
      ? { hits: formatNumber(data.header.hits), pens: formatNumber(data.header.pens), damage: formatNumber(data.header.damage) }
      : null,
    rows: rows.map((row, key) => ({
      ...row,
      key,
      damageText: row.damage === null ? '' : formatNumber(row.damage),
      hitsText: data.grouped && row.hits > 1 ? `×${row.hits}` : '',
      hpText: row.hp === null ? '' : formatNumber(row.hp),
      hasBar: row.hp !== null && row.max !== null
    }))
  };
};
