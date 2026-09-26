'use client';

import { NationFlag, TANK_CLASS_ICONS, toRoman } from '@bronevik/icons';
import { useTranslations } from 'next-intl';

import { TankImage } from '@/entities/tank/tank';

import { useTank } from '../../../model/context';
import { GarageActions, ParamsPanel } from './components';

import s from './TankGarage.module.scss';

export const TankGarage = () => {
  const t = useTranslations('tank.garage');
  const tGame = useTranslations('game');
  const { detail, identity } = useTank();

  const ClassIcon = TANK_CLASS_ICONS[identity.type];

  return (
    <section aria-labelledby='tank-name' className={s.root}>
      <div className={s.garage}>
        <p className={s.line}>
          <ClassIcon aria-label={tGame(`classes.${identity.type}`)} size={16} variant={identity.isPremium ? 'premium' : 'regular'} />
          <span className={s.tier}>{toRoman(identity.tier)}</span>
          <span>{tGame(`nations.${identity.nation}`)}</span>
          <span className={s.kind} data-premium={identity.isPremium}>
            {identity.isPremium ? t('premium') : t('regular')}
          </span>
        </p>
        <h1 className={s.name} data-premium={identity.isPremium} id='tank-name'>
          {detail.vehicle.name}
        </h1>
        <div className={s.stage} data-nation={identity.nation}>
          <NationFlag aria-hidden className={s.flag} nation={identity.nation} />
          <TankImage isPriority className={s.render} size='big' tank={identity} withTint={false} />
        </div>
        {detail.description && <p className={s.description}>{detail.description}</p>}
        <GarageActions />
      </div>
      <ParamsPanel />
    </section>
  );
};
