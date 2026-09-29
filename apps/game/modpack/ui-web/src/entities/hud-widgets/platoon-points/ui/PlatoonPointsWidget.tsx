import clsx from 'clsx';

import type { PlatoonPointsWidgetProps } from './PlatoonPointsWidget.types';

import { ClientIcon, HudPlate, IconNumber, MiniBar } from '../../../../shared/ui/hud';
import { PLATOON_POINTS } from '../config';

import s from './PlatoonPointsWidget.module.scss';

export const PlatoonPointsWidget = ({ data }: PlatoonPointsWidgetProps) => (
  <HudPlate className={s.plate} rail='ally'>
    <div className={s.header}>
      <ClientIcon icon={data.icon} size={18} />
      <span className={s.total}>{data.total}</span>
    </div>
    {data.rows.map((row) => (
      <div key={row.name} className={s.row} style={{ opacity: row.alive ? 1 : PLATOON_POINTS.deadAlpha }}>
        <ClientIcon icon={row.cls} size={PLATOON_POINTS.iconSize} />
        <div className={s.member}>
          <span className={clsx(s.name, row.own && s.own)}>{row.name}</span>
          <MiniBar height={PLATOON_POINTS.bar.height} max={row.max} tone='ally' value={row.hp} width={PLATOON_POINTS.bar.width} />
        </div>
        <IconNumber icon={PLATOON_POINTS.fragGlyph} size={12} tone='muted' value={String(row.frags)} />
        <span className={s.points}>{row.points}</span>
      </div>
    ))}
  </HudPlate>
);
