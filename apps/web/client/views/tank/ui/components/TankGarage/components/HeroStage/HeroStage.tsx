'use client';

import { NationFlag } from '@otmetki/icons';

import { ROUTES } from '@/shared/constants';
import { TankShowcase3D } from '@/widgets/showcase/showcase-3d';

import { useTank } from '../../../../../model/context';

import s from './HeroStage.module.scss';

export const HeroStage = () => {
  const { identity, detail, slug } = useTank();

  return (
    <div className={s.root} data-nation={identity.nation}>
      <span aria-hidden className={s.glow} />
      <NationFlag aria-hidden className={s.flag} nation={identity.nation} />
      <div className={s.showcase} data-slot='showcase-3d'>
        <TankShowcase3D armorHref={ROUTES.tanks.armor(slug)} className={s.render} tank={detail.vehicle} />
      </div>
    </div>
  );
};
