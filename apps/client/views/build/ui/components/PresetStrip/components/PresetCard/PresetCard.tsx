'use client';

import { Check, CornerDownLeft } from 'lucide-react';
import { motion } from 'motion/react';
import { useFormatter, useTranslations } from 'next-intl';

import { popularLoadout } from '@/entities/tank/build';
import { PERCENT_TEXT, percentText, STAGGER_ITEM } from '@/shared/lib';
import { Badge } from '@/ui-kit';

import type { PresetCardProps } from './PresetCard.types';

import { toBuildItem } from '../../../../../lib/build-catalog';
import { sameLoadout } from '../../../../../lib/loadout-edit';
import { useBuildContext } from '../../../../../model/context';

import s from './PresetCard.module.scss';

export const PresetCard = ({ preset, source }: PresetCardProps) => {
  const t = useTranslations('builds.presets');
  const format = useFormatter();
  const { catalog, active, side, edit } = useBuildContext();

  const { share, winRate, avgDamage, battles } = preset;
  const loadout = {
    ...popularLoadout(preset),
    profileId: active.profileId,
    crewSkills: active.crewSkills,
    fieldModifications: active.fieldModifications
  };

  const isActive = sameLoadout({ a: active, b: loadout, modules: catalog.modules });
  const equipment = preset.optionalDevices.map(toBuildItem);

  const onApply = () => edit(() => loadout);

  return (
    <motion.li className={s.item} variants={STAGGER_ITEM}>
      <button aria-pressed={isActive} className={s.root} data-active={isActive} type='button' onClick={onApply}>
        <span className={s.top}>
          <Badge tone={source === 'battles' ? 'accent' : 'steel'}>{t(`source.${source}`)}</Badge>
          <span className={s.share}>
            <span className={s.label}>{t('share')}</span>
            {format.number(share, { style: 'percent', maximumFractionDigits: 1 })}
          </span>
        </span>
        <span className={s.gear}>
          {equipment.map(({ id, name, category }) => (
            <span key={id} className={s.gearItem} data-category={category ?? undefined}>
              {name}
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
        <span className={s.cta}>
          {isActive ? <Check size={14} /> : <CornerDownLeft size={14} />}
          {isActive ? t('active') : t('apply', { side: side.toUpperCase() })}
        </span>
      </button>
    </motion.li>
  );
};
