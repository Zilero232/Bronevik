'use client';

import { useTranslations } from 'next-intl';

import { Switch } from '@/ui-kit';

import { useArmorAttack } from '../../../../model/context';

export const HeatmapToggle = () => {
  const t = useTranslations('armor.heatmap');
  const { heatmap, setHeatmap } = useArmorAttack();

  return <Switch checked={heatmap} description={t('description')} label={t('toggle')} onCheckedChange={setHeatmap} />;
};
