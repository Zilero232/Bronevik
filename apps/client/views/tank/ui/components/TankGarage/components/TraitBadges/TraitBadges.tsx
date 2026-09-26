'use client';

import { LearningBadge, TankRoleBadge, TankStatusBadge } from '@/entities/tank/tank';

import { useTank } from '../../../../../model/context';

import s from './TraitBadges.module.scss';

export const TraitBadges = () => {
  const { detail } = useTank();

  const { obtain, learning } = detail;

  return (
    <p className={s.root}>
      <TankStatusBadge status={obtain.status} />
      {obtain.role && <TankRoleBadge role={obtain.role} />}
      {learning.difficulty && <LearningBadge difficulty={learning.difficulty} />}
    </p>
  );
};
