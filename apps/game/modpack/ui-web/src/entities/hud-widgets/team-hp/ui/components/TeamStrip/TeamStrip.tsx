import clsx from 'clsx';

import type { TeamStripProps } from './TeamStrip.types';

import { ClientIcon } from '../../../../../../shared/ui/hud';
import { TEAM_HP } from '../../../config';

import s from './TeamStrip.module.scss';

export const TeamStrip = ({ items, color, mirrored = false }: TeamStripProps) => (
  <div className={clsx(s.strip, mirrored && s.mirrored)}>
    {items.map((item) =>
      item.kind === 'tier' ? (
        <span key={item.key} className={s.tier}>
          {item.label}
        </span>
      ) : (
        <div key={item.key} className={s.vehicle} style={{ opacity: item.alpha }}>
          <ClientIcon icon={item.icon} size={TEAM_HP.iconSize} />
          <div className={s.track}>
            <div className={s.fill} style={{ width: `${item.bar}rem`, backgroundColor: color }} />
          </div>
        </div>
      )
    )}
  </div>
);
