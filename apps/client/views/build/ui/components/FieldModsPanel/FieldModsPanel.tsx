'use client';

import { useTranslations } from 'next-intl';

import { Switch } from '@/ui-kit';

import { useBuildContext } from '../../../model/context';
import { PanelCard } from '../PanelCard';
import { FieldModStep } from './components';

import s from './FieldModsPanel.module.scss';

export const FieldModsPanel = () => {
  const t = useTranslations('builds.panels.fieldMods');
  const { catalog, still, setStill } = useBuildContext();

  return (
    <PanelCard description={t('description')} title={t('title')}>
      <Switch checked={still} description={t('stillHint')} label={t('still')} onCheckedChange={setStill} />
      <ol className={s.steps}>
        {catalog.fieldSteps.map((step) => (
          <FieldModStep key={step.key} step={step} />
        ))}
      </ol>
    </PanelCard>
  );
};
