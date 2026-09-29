import type { ArtyMeterData } from '../../model/schemas';
import type { ArtyView } from './arty-view.types';

import { formatNumber } from '../../../../../shared/lib/hud-format';
import { ARTY_METER } from '../../config';

export const artyView = (data: ArtyMeterData): ArtyView => {
  const { battle } = data;
  const level = Math.min(battle.total, data.scale);

  return {
    level: Math.round((level / Math.max(1, data.scale)) * ARTY_METER.tube.height),
    tone: battle.total >= ARTY_METER.hotFrom ? 'received' : battle.total >= ARTY_METER.warmFrom ? 'warning' : 'success',
    counters: [
      { key: 'hits', icon: ARTY_METER.glyphs.hits, value: formatNumber(battle.hits), tone: 'text' },
      { key: 'splash', icon: ARTY_METER.glyphs.splash, value: formatNumber(battle.splash), tone: 'text' },
      { key: 'modules', icon: ARTY_METER.glyphs.modules, value: formatNumber(battle.modules), tone: 'warning' },
      { key: 'stuns', icon: ARTY_METER.glyphs.stuns, value: formatNumber(battle.stuns), tone: 'stun' },
      { key: 'damage', icon: ARTY_METER.glyphs.damage, value: formatNumber(-battle.damage), tone: 'received' }
    ],
    day: data.day ? `${data.day.battles} · ${formatNumber(data.day.total)} · ${formatNumber(-data.day.damage)}` : null,
    marks: [data.scale, Math.round(data.scale / 2), 0]
  };
};
