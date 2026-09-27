'use client';

import { PlayerNameCell } from '@/entities/player/player';
import { RatingValue } from '@/entities/player/stats';

import type { RosterCardProps } from './RosterCard.types';

import { AttendanceCell } from '../AttendanceCell';
import { RoleCell } from '../RoleCell';

import s from './RosterCard.module.scss';

export const RosterCard = ({ row }: RosterCardProps) => (
  <article className={s.root} data-officer={row.isOfficer}>
    <div className={s.main}>
      <PlayerNameCell nickname={row.nickname} withAvatar={false} />
      <RoleCell isOfficer={row.isOfficer} role={row.role} />
    </div>
    <div className={s.figures}>
      <AttendanceCell row={row} />
      <RatingValue rating={row.recentWn8} />
    </div>
  </article>
);
