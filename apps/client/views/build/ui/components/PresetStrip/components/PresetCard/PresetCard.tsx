'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { PERCENT_TEXT, percentText } from '@/shared/lib';
import { Badge } from '@/ui-kit';

import type { PresetCardProps } from './PresetCard.types';

import { BUILD_VIEW } from '../../../../../config';
import { usePresetCard } from '../../../../../model/hooks';
import { GameIcon } from '../../../GameIcon';

import s from './PresetCard.module.scss';

export const PresetCard = ({ preset, source }: PresetCardProps) => {
  const t = useTranslations('builds.presets');
  const format = useFormatter();
  const { side, equipment, isActive, onApply } = usePresetCard({ preset });

  const { share, winRate, avgDamage, battles } = preset;

  return (
    <li className={s.item}>
      <button aria-pressed={isActive} className={s.root} type='button' onClick={onApply}>
        <span className={s.top}>
          <Badge tone='steel'>{t(`source.${source}`)}</Badge>
          <span className={s.share}>
            <span className={s.label}>{t('share')}</span>
            {format.number(share, { style: 'percent', maximumFractionDigits: 1 })}
          </span>
        </span>
        <span className={s.gear}>
          {equipment.map(({ id, name, image, category }) => (
            <span key={id} className={s.gearItem} data-category={category ?? undefined} title={name}>
              <GameIcon size={BUILD_VIEW.iconSize.gear} src={image} />
              <span className={s.gearName}>{name}</span>
            </span>
          ))}
        </span>
        <span className={s.stats}>
          <span className={s.stat}>
            <span className={s.label}>{t('winRate')}</span>
            <span className={s.value}>{percentText({ format, value: winRate })}</span>
          </span>
          <span className={s.stat}>
            <span className={s.label}>{t('avgDamage')}</span>
            <span className={s.value}>{avgDamage === null ? PERCENT_TEXT.empty : format.number(avgDamage)}</span>
          </span>
          <span className={s.battles}>{t('battles', { count: battles })}</span>
        </span>
        <span className={s.cta}>{isActive ? t('active') : t('apply', { side: side.toUpperCase() })}</span>
      </button>
    </li>
  );
};
