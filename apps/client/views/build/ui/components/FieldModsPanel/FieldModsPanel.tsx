'use client';

import { motion } from 'motion/react';
import { useTranslations } from 'next-intl';

import { STAGGER } from '@/shared/lib';
import { Switch } from '@/ui-kit';

import { PANEL_ICONS } from '../../../config';
import { useBuildContext } from '../../../model/context';
import { PanelCard } from '../PanelCard';
import { FieldModStep } from './components';

import s from './FieldModsPanel.module.scss';

export const FieldModsPanel = () => {
  const t = useTranslations('builds.panels.fieldMods');
  const { catalog, still, setStill } = useBuildContext();

  return (
    <PanelCard description={t('description')} icon={PANEL_ICONS.fieldMods} index='// 07' title={t('title')}>
      <div className={s.body}>
        <Switch checked={still} className={s.still} description={t('stillHint')} label={t('still')} onCheckedChange={setStill} />
        <motion.ol className={s.tree} initial='hidden' variants={STAGGER} viewport={{ once: true, amount: 0.2 }} whileInView='visible'>
          {catalog.fieldSteps.map((step) => (
            <FieldModStep key={step.key} step={step} />
          ))}
        </motion.ol>
      </div>
    </PanelCard>
  );
};
