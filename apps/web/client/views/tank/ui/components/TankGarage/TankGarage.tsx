'use client';

import { TANK_CLASS_ICONS } from '@otmetki/icons';
import { useTranslations } from 'next-intl';
import { useId } from 'react';

import { TANK_SECTIONS } from '../../../config';
import { useTank } from '../../../model/context';
import { GarageActions, HeroCrumbs, HeroFigures, HeroStage, ParamsPanel, TraitBadges } from './components';

import s from './TankGarage.module.scss';

export const TankGarage = () => {
  const t = useTranslations('tank.garage');
  const titleId = useId();
  const tGame = useTranslations('game');
  const { detail, identity } = useTank();

  const ClassIcon = TANK_CLASS_ICONS[identity.type];

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
            <p className={s.line}>
              <ClassIcon aria-label={tGame(`classes.${identity.type}`)} size={16} variant={identity.isPremium ? 'premium' : 'regular'} />
              <span className={s.kind} data-premium={identity.isPremium}>
                {identity.isPremium ? t('premium') : t('regular')}
              </span>
            </p>
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
