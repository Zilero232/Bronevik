import { ModeRankBadge } from '@/entities/mode/mode';
import { TankLink, WinRateCell } from '@/entities/tank/tank';

import type { LeaderRowProps } from './LeaderRow.types';

import s from './LeaderRow.module.scss';

export const LeaderRow = ({ leader }: LeaderRowProps) => (
  <li className={s.root}>
    <ModeRankBadge rank={leader.rank} />
    <TankLink className={s.tank} image='small' vehicle={leader.vehicle} />
    <WinRateCell className={s.value} value={leader.winRate} />
  </li>
);
