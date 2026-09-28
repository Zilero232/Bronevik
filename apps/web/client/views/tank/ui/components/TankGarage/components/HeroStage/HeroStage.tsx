'use client';

import { NationFlag } from '@otmetki/icons';

import { TankShowcase3D } from '@/widgets/showcase/showcase-3d';

import { useTank } from '../../../../../model/context';

import s from './HeroStage.module.scss';

export const HeroStage = () => {
  const { identity, detail } = useTank();

  return (
    <div className={s.root} data-nation={identity.nation}>
      <span aria-hidden className={s.glow} />
      <NationFlag aria-hidden className={s.flag} nation={identity.nation} />
      <div className={s.showcase} data-slot='showcase-3d'>
        <TankShowcase3D className={s.render} tank={detail.vehicle} />
      </div>
    </div>
  );
};
