'use client';

import { TANK_CLASS_ICONS, toRoman } from '@bronevik/icons';
import { ArrowRight, Gem, LoaderCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

import type { PresetCardProps } from './PresetCard.types';

import s from './PresetCard.module.scss';

export const PresetCard = ({ preset, isPending, isDisabled, onApply }: PresetCardProps) => {
  const t = useTranslations('tanks.compare.presets');

  const { key, tiers, types } = preset;
  const type = types?.at(0);
  const Icon = type ? TANK_CLASS_ICONS[type] : Gem;

  return (
    <button aria-busy={isPending} className={s.root} disabled={isDisabled} type='button' onClick={onApply}>
      <span aria-hidden className={s.tier}>
        {tiers.map(toRoman).join('·')}
      </span>
      <span className={s.icon}>
        <Icon size={26} strokeWidth={1.5} />
      </span>
      <span className={s.title}>{t(`items.${key}.title`)}</span>
      <span className={s.hint}>{t(`items.${key}.hint`)}</span>
      <span className={s.cta}>
        {isPending ? t('loading') : t('apply')}
        {isPending ? <LoaderCircle className={s.spinner} size={14} /> : <ArrowRight className={s.arrow} size={14} />}
      </span>
    </button>
  );
};
