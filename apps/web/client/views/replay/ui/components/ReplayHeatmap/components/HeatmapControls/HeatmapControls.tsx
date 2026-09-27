'use client';

import { useTranslations } from 'next-intl';

import { ClassIcon, SegmentedControl } from '@/ui-kit';

import type { HeatmapModeChoice, HeatmapScope } from '../../../../../model/hooks';
import type { HeatmapControlsProps } from './HeatmapControls.types';

import { HEATMAP_SCOPE_CLASS, HEATMAP_SCOPES } from '../../../../../config';

import s from './HeatmapControls.module.scss';

export const HeatmapControls = ({ hasReplayMode, modeChoice, scope, onModeChoiceChange, onScopeChange }: HeatmapControlsProps) => {
  const t = useTranslations('replays.heatmap');

  return (
    <div className={s.root}>
      {hasReplayMode && (
        <SegmentedControl<HeatmapModeChoice>
          options={[
            { value: 'replay', label: t('modes.replay') },
            { value: 'all', label: t('modes.all') }
          ]}
          aria-label={t('modeLabel')}
          size='sm'
          value={modeChoice}
          onChange={onModeChoiceChange}
        />
      )}
      <SegmentedControl<HeatmapScope>
        options={HEATMAP_SCOPES.map((value) =>
          value === 'all'
            ? { value, label: t('scopes.all') }
            : { value, label: <ClassIcon size={14} tankClass={HEATMAP_SCOPE_CLASS[value]} />, 'aria-label': t(`scopes.${value}`) }
        )}
        aria-label={t('scopeLabel')}
        size='sm'
        value={scope}
        onChange={onScopeChange}
      />
    </div>
  );
};
