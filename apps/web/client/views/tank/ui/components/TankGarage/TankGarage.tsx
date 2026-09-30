'use client';

import { useId } from 'react';

import { TANK_SECTIONS } from '../../../config';
import { useTank } from '../../../model/context';
import { GarageActions, HeroCrumbs, HeroFigures, HeroStage, ParamsPanel, TraitBadges } from './components';

import s from './TankGarage.module.scss';

export const TankGarage = () => {
  const titleId = useId();
  const { detail, identity } = useTank();

  return (
    <section aria-labelledby={titleId} className={s.root} id={TANK_SECTIONS.overview}>
      <div className={s.hero} data-class={identity.type}>
        <div className={s.inner}>
          <HeroStage />
          <div className={s.info}>
            <HeroCrumbs />
            <h1 className={s.name} data-premium={identity.isPremium} id={titleId}>
              {detail.vehicle.name}
            </h1>
            <TraitBadges />
            <HeroFigures />
            {detail.description && <p className={s.description}>{detail.description}</p>}
            <GarageActions />
          </div>
        </div>
      </div>
      <div className={s.params}>
        <ParamsPanel />
      </div>
    </section>
  );
};
