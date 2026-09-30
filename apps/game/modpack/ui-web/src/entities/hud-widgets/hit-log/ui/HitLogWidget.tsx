import clsx from 'clsx';

import type { HitLogWidgetProps } from './HitLogWidget.types';

import { ClientIcon, HudPlate, IconNumber, MiniBar, toneClass } from '../../../../shared/ui/hud';
import { HIT_LOG } from '../config';
import { hitLogView } from '../lib/hit-log-view';

import s from './HitLogWidget.module.scss';

export const HitLogWidget = ({ data }: HitLogWidgetProps) => {
  const view = hitLogView(data);

  return (
    <HudPlate className={s.plate} rail='damage'>
      {view.header && (
        <div className={s.header}>
          <IconNumber icon={HIT_LOG.glyphs.hits} tone='muted' value={view.header.hits} />
          <IconNumber icon={HIT_LOG.glyphs.pens} tone='success' value={view.header.pens} />
          <IconNumber icon={HIT_LOG.glyphs.damage} tone='accent' value={view.header.damage} />
        </div>
      )}
      {view.rows.map((row) => (
        <div key={row.key} className={s.row}>
          <ClientIcon className={s.icon} icon={row.icon} size={HIT_LOG.iconSize} tone={row.tone} />
          <span className={clsx(s.damage, toneClass(row.tone))}>{row.damageText}</span>
          <span className={s.hits}>{row.hitsText}</span>
          <ClientIcon className={s.icon} icon={row.cls} size={HIT_LOG.iconSize} />
          <span className={s.name}>{row.name}</span>
          {row.hasBar && <MiniBar height={HIT_LOG.bar.height} max={row.max ?? 0} tone='enemy' value={row.hp ?? 0} width={HIT_LOG.bar.width} />}
          <span className={s.hp}>{row.hpText}</span>
          {row.note && <span className={s.note}>{row.note}</span>}
        </div>
      ))}
    </HudPlate>
  );
};
