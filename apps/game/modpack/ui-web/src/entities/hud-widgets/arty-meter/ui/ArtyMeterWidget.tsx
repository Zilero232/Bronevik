import clsx from 'clsx';

import type { ArtyMeterWidgetProps } from './ArtyMeterWidget.types';

import { ClientIcon, HudPlate, IconNumber } from '../../../../shared/ui/hud';
import { ARTY_METER } from '../config';
import { artyView } from '../lib/arty-view';

import s from './ArtyMeterWidget.module.scss';

export const ArtyMeterWidget = ({ data }: ArtyMeterWidgetProps) => {
  const view = artyView(data);

  return (
    <HudPlate className={s.plate} rail='stun'>
      <div className={s.body}>
        <div className={s.thermometer}>
          <div className={s.tube} style={{ width: `${ARTY_METER.tube.width}rem`, height: `${ARTY_METER.tube.height}rem` }}>
            <div className={clsx(s.level, s[view.tone])} style={{ height: `${view.level}rem` }} />
          </div>
          <div className={s.scale}>
            {view.marks.map((mark) => (
              <span key={mark}>{mark}</span>
            ))}
          </div>
        </div>
        <div className={s.counters}>
          <ClientIcon className={s.title} icon={data.icon} size={20} />
          {view.counters.map((counter) => (
            <IconNumber key={counter.key} icon={counter.icon} size={ARTY_METER.iconSize} tone={counter.tone} value={counter.value} />
          ))}
        </div>
      </div>
      {view.day !== null && (
        <div className={s.day}>
          <ClientIcon icon={ARTY_METER.glyphs.day} size={12} />
          <span className={s.dayText}>{view.day}</span>
        </div>
      )}
    </HudPlate>
  );
};
