import clsx from 'clsx';

import type { TeamStripProps } from './TeamStrip.types';

import { ClientIcon } from '../../../../../../shared/ui/hud';
import { TEAM_HP } from '../../../config';

import s from './TeamStrip.module.scss';

export const TeamStrip = ({ vehicles, color, mirrored = false }: TeamStripProps) => (
  <div className={clsx(s.strip, mirrored && s.mirrored)}>
    {vehicles.map((vehicle) => (
      <div key={vehicle.key} className={s.vehicle} style={{ opacity: vehicle.alpha }}>
        <ClientIcon icon={vehicle.icon} size={TEAM_HP.iconSize} />
        <div className={s.track}>
          <div className={s.fill} style={{ width: `${vehicle.bar}rem`, backgroundColor: color }} />
        </div>
      </div>
    ))}
  </div>
);
