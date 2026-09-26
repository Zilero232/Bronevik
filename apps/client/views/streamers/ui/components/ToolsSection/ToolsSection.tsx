'use client';

import { useTranslations } from 'next-intl';

import { SectionHeader } from '@/ui-kit';

import { TOOL_CARDS } from '../../../config';
import { ToolCard } from '../ToolCard';

import s from './ToolsSection.module.scss';

export const ToolsSection = () => {
  const t = useTranslations('streamers.tools');

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} title={t('title')} />
      <div className={s.grid}>
        {TOOL_CARDS.map(({ key, icon }) => (
          <ToolCard key={key} icon={icon} tool={key} />
        ))}
      </div>
    </section>
  );
};
