'use client';

import { TANK_CLASS_ICONS, toRoman } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import type { PresetCardProps } from './PresetCard.types';

import s from './PresetCard.module.scss';

export const PresetCard = ({ preset, isPending, isDisabled, onApply }: PresetCardProps) => {
  const t = useTranslations('tanks.compare.presets');

  const { key, tiers, types, premium } = preset;
  const type = types?.at(0);
  const Icon = type ? TANK_CLASS_ICONS[type] : null;

  return (
    <button aria-busy={isPending} className={s.root} disabled={isDisabled} type='button' onClick={onApply}>
      <span className={s.meta}>
        {Icon && <Icon aria-hidden size={16} variant={premium ? 'premium' : 'regular'} />}
        <span className={s.tier}>{tiers.map(toRoman).join(' · ')}</span>
      </span>
      <span className={s.title}>{t(`items.${key}.title`)}</span>
      <span className={s.hint}>{t(`items.${key}.hint`)}</span>
      <span className={s.cta}>{isPending ? t('loading') : t('apply')}</span>
    </button>
  );
};
