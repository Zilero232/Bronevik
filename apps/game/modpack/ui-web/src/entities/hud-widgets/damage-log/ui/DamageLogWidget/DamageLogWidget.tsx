import clsx from 'clsx';

import type { DamageLogWidgetProps } from './DamageLogWidget.types';

import { ClientIcon, HudPlate, IconNumber, toneClass } from '../../../../../shared/ui/hud';
import { DAMAGE_LOG } from '../../config';
import { damageLogView } from '../../lib/damage-log-view';

import s from './DamageLogWidget.module.scss';

export const DamageLogWidget = ({ data }: DamageLogWidgetProps) => {
  const view = damageLogView(data);

  return (
    <HudPlate className={s.plate} rail='accent'>
      <div className={s.totals}>
        {view.totals.map((total) => (
          <IconNumber key={total.key} icon={total.icon} minWidth={DAMAGE_LOG.totalWidth} tone={total.tone} value={total.value} />
        ))}
      </div>
      {view.rows.length > 0 && <div className={s.divider} />}
      {view.rows.map((row) => (
        <div key={row.key} className={clsx(s.row, row.key === 0 && s.newest)}>
          <span className={clsx(s.amount, toneClass(row.tone))}>{row.text}</span>
          <span className={clsx(s.shell, row.gold && s.gold)}>
            <ClientIcon icon={row.icon} size={DAMAGE_LOG.shellSize} />
          </span>
          <ClientIcon className={s.icon} icon={row.cls} size={DAMAGE_LOG.iconSize} />
          <span className={s.name}>{row.name}</span>
          <ClientIcon className={s.icon} icon={row.source} size={DAMAGE_LOG.iconSize} />
          <ClientIcon className={s.icon} icon={row.ammo_rack} size={DAMAGE_LOG.iconSize} />
        </div>
      ))}
    </HudPlate>
  );
};
