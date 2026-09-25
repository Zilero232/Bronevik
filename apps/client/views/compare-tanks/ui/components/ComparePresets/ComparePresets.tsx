'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { STAGGER, STAGGER_ITEM } from '@/shared/lib';
import { SectionHeader } from '@/ui-kit';

import { COMPARE_PRESETS } from '../../../config';
import { useComparePresets } from '../../../model/hooks';
import { PresetCard } from '../PresetCard';

import s from './ComparePresets.module.scss';

export const ComparePresets = () => {
  const t = useTranslations('tanks.compare.presets');
  const { pendingKey, apply } = useComparePresets();

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='// 01' title={t('title')} />
      <motion.ul animate='visible' className={s.grid} initial='hidden' variants={STAGGER}>
        {COMPARE_PRESETS.map((preset) => (
          <motion.li key={preset.key} variants={STAGGER_ITEM}>
            <PresetCard isDisabled={pendingKey !== null} isPending={pendingKey === preset.key} preset={preset} onApply={() => void apply(preset)} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
};
