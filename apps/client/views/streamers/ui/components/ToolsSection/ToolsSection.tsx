'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { REVEAL_VIEWPORT, STAGGER } from '@/shared/lib';
import { SectionHeader } from '@/ui-kit';

import { TOOL_CARDS } from '../../../config';
import { ToolCard } from '../ToolCard';

import s from './ToolsSection.module.scss';

export const ToolsSection = () => {
  const t = useTranslations('streamers.tools');

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} eyebrow={t('eyebrow')} index='01' title={t('title')} />
      <motion.div className={s.grid} initial='hidden' variants={STAGGER} viewport={REVEAL_VIEWPORT} whileInView='visible'>
        {TOOL_CARDS.map(({ key, icon }) => (
          <ToolCard key={key} icon={icon} tool={key} />
        ))}
      </motion.div>
    </section>
  );
};
