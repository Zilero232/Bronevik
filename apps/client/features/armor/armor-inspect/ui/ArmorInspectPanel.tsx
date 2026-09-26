'use client';

import { useTranslations } from 'next-intl';

import { ArmorLegend } from './ArmorLegend';
import { LayerToggles, ModulePicker, ShellControls } from './components';

import s from './ArmorInspectPanel.module.scss';

export const ArmorInspectPanel = () => {
  const t = useTranslations('armor.controls');

  return (
    <aside aria-label={t('panel')} className={s.root}>
      <ModulePicker />
      <ShellControls />
      <LayerToggles />
      <span aria-hidden className={s.divider} />
      <ArmorLegend />
    </aside>
  );
};
