'use client';

import { useTranslations } from 'next-intl';

import { SegmentedControl } from '@/ui-kit';

import type { ArmorPaneKey } from '../../../lib/camera-sync';
import type { PaneSwitchProps } from './PaneSwitch.types';

import s from './PaneSwitch.module.scss';

export const PaneSwitch = ({ value, primaryName, secondaryName, onChange }: PaneSwitchProps) => {
  const t = useTranslations('armor.compare');

  return (
    <div className={s.root}>
      <SegmentedControl<ArmorPaneKey>
        options={[
          { value: 'primary', label: primaryName },
          { value: 'secondary', label: secondaryName }
        ]}
        aria-label={t('switch')}
        size='sm'
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
