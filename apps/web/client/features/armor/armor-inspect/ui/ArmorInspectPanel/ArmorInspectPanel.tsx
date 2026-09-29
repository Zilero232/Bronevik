'use client';

import { useTranslations } from 'next-intl';

import type { ArmorInspectPanelProps } from './ArmorInspectPanel.types';

import { ArmorLegend } from '../ArmorLegend';
import { HeatmapToggle, LayerToggles, ShellControls } from './components';

import s from './ArmorInspectPanel.module.scss';

export const ArmorInspectPanel = ({ attacker }: ArmorInspectPanelProps) => {
  const t = useTranslations('armor.controls');

  return (
    <aside aria-label={t('panel')} className={s.root}>
      {attacker}
      <ShellControls />
      <HeatmapToggle />
      <LayerToggles />
      <span aria-hidden className={s.divider} />
      <ArmorLegend />
    </aside>
  );
};
