'use client';

import { useTranslations } from 'next-intl';

import { Card, CardHeader } from '@/ui-kit';

import { COMPARE_PRESETS } from '../../../config';
import { useComparePresets } from '../../../model/hooks';
import { PresetCard } from '../PresetCard';

import s from './ComparePresets.module.scss';

export const ComparePresets = () => {
  const t = useTranslations('tanks.compare.presets');
  const { pendingKey, apply } = useComparePresets();

  return (
    <Card padding='none'>
      <CardHeader className={s.header} title={t('title')} />
      <ul className={s.grid}>
        {COMPARE_PRESETS.map((preset) => (
          <li key={preset.key}>
            <PresetCard isDisabled={pendingKey !== null} isPending={pendingKey === preset.key} preset={preset} onApply={() => void apply(preset)} />
          </li>
        ))}
      </ul>
    </Card>
  );
};
