'use client';

import { useTranslations } from 'next-intl';

import { ToggleChips } from '@/ui-kit';

import type { ArmorLayerKey } from '../../../../model/context';

import { ARMOR_LAYERS } from '../../../../config';
import { useArmorAttack } from '../../../../model/context';

import s from './LayerToggles.module.scss';

export const LayerToggles = () => {
  const t = useTranslations('armor');
  const { layers, setLayers } = useArmorAttack();

  return (
    <div className={s.root}>
      <span className={s.label}>{t('controls.layers')}</span>
      <ToggleChips<ArmorLayerKey>
        aria-label={t('controls.layers')}
        options={ARMOR_LAYERS.map((layer) => ({ value: layer, label: t(`layers.${layer}`) }))}
        size='sm'
        value={layers}
        onChange={setLayers}
      />
    </div>
  );
};
