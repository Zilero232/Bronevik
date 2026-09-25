'use client';

import { NATION_ICONS, TANK_CLASS_ICONS, TierIcon } from '@bronevik/icons';
import { useTranslations } from 'next-intl';

import { Badge } from '@/ui-kit';

import { useTank } from '../../../../../model/context';

import s from './HeroMeta.module.scss';

export const HeroMeta = () => {
  const t = useTranslations('tank.hero');
  const tGame = useTranslations('game');
  const { identity } = useTank();

  const { type, nation, tier, isPremium } = identity;
  const ClassIcon = TANK_CLASS_ICONS[type];
  const NationIcon = NATION_ICONS[nation];

  return (
    <ul aria-label={t('metaLabel')} className={s.root}>
      <li className={s.chip}>
        <ClassIcon aria-hidden className={s.icon} size={18} variant={isPremium ? 'premium' : 'regular'} />
        {tGame(`classes.${type}`)}
      </li>
      <li className={s.chip}>
        <NationIcon aria-hidden className={s.icon} palette='color' size={20} />
        {tGame(`nations.${nation}`)}
      </li>
      <li className={s.chip}>
        <TierIcon aria-hidden engraved className={s.icon} size={20} strokeWidth={1.5} tier={tier} />
        {t('tier', { tier })}
      </li>
      {isPremium && (
        <li>
          <Badge tone='accent'>{t('premium')}</Badge>
        </li>
      )}
    </ul>
  );
};
