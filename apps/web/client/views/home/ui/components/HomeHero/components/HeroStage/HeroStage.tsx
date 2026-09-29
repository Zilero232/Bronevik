'use client';

import { TankShowcase3D } from '@/widgets/showcase/showcase-3d';

import { useHeroTanks } from '../../../../../model/hooks';

import s from './HeroStage.module.scss';

export const HeroStage = () => {
  const { rows, isEmpty } = useHeroTanks();
  const lead = rows[0];

  if (isEmpty) {
    return null;
  }

  return (
    <div className={s.root} data-nation={lead?.vehicle.nation} data-slot='showcase-3d'>
      <span aria-hidden className={s.backdrop} />
      {rows.length > 0 && <TankShowcase3D className={s.showcase} tanks={rows.map((row) => row.vehicle)} />}
    </div>
  );
};
