import clsx from 'clsx';

import type { ConsumablesWidgetProps } from './ConsumablesWidget.types';

import { ClientIcon, HudPlate, RadialTimer } from '../../../../../shared/ui/hud';
import { CONSUMABLES } from '../../config';
import { consumablesView } from '../../lib/consumables-view';

import s from './ConsumablesWidget.module.scss';

export const ConsumablesWidget = ({ data }: ConsumablesWidgetProps) => {
  const view = consumablesView(data);

  return (
    <HudPlate className={s.plate} rail='info'>
      {data.stats.map((stats) => (
        <div key={`${stats.icon ?? ''}|${stats.text}`} className={clsx(s.stats, stats.current && s.current)}>
          <ClientIcon icon={stats.icon} size={CONSUMABLES.statsIcon} />
          <span className={s.text}>{stats.text}</span>
        </div>
      ))}
      <div className={s.row}>
        {view.slots.map((slot) => (
          <div key={slot.key} className={s.slot} style={{ opacity: slot.alpha }}>
            <RadialTimer progress={slot.progress} size={CONSUMABLES.slot.size} stroke={CONSUMABLES.slot.stroke} tone='accent'>
              <ClientIcon icon={slot.icon} size={CONSUMABLES.slot.icon} />
            </RadialTimer>
            {slot.seconds && <span className={s.seconds}>{slot.seconds}</span>}
          </div>
        ))}
        {view.shells.map((shell) => (
          <div key={shell.key} className={clsx(s.shell, shell.current && s.current)}>
            <ClientIcon icon={shell.icon} size={CONSUMABLES.shellIcon} />
            <span className={clsx(s.count, shell.quantity === 0 && s.empty)}>{shell.count}</span>
          </div>
        ))}
      </div>
    </HudPlate>
  );
};
