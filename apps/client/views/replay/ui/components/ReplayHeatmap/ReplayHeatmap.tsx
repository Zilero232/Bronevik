'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { Card, CardBody, CardHeader, ClassIcon, EmptyState, ErrorState, SegmentedControl, Skeleton } from '@/ui-kit';

import type { HeatmapModeChoice, HeatmapScope } from '../../../model/hooks';
import type { ReplayHeatmapProps } from './ReplayHeatmap.types';

import { HEATMAP_SCOPE_CLASS, HEATMAP_SCOPES } from '../../../config';
import { useReplayHeatmap } from '../../../model/hooks';

import s from './ReplayHeatmap.module.scss';

export const ReplayHeatmap = ({ replay }: ReplayHeatmapProps) => {
  const t = useTranslations('replays.heatmap');
  const format = useFormatter();
  const {
    hasArena,
    hasReplayMode,
    modeChoice,
    scope,
    gridSize,
    samples,
    cells,
    gridLines,
    levels,
    isPending,
    isError,
    isFetching,
    setModeChoice,
    setScope,
    retry
  } = useReplayHeatmap(replay);

  return (
    <Card aria-labelledby='replay-heatmap-title' padding='none'>
      <CardHeader meta={replay.mapName ?? replay.arenaId} title={<span id='replay-heatmap-title'>{t('title')}</span>} />
      <CardBody className={s.body}>
        {!hasArena && <EmptyState isCompact description={t('noArenaDescription')} title={t('noArenaTitle')} />}
        {hasArena && (
          <>
            <div className={s.controls}>
              {hasReplayMode && (
                <SegmentedControl<HeatmapModeChoice>
                  options={[
                    { value: 'replay', label: t('modes.replay') },
                    { value: 'all', label: t('modes.all') }
                  ]}
                  aria-label={t('modeLabel')}
                  size='sm'
                  value={modeChoice}
                  onChange={setModeChoice}
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
                onChange={setScope}
              />
            </div>
            {isPending && <Skeleton className={s.map} shape='block' />}
            {isError && !isPending && (
              <ErrorState isCompact description={t('errorDescription')} isRetrying={isFetching} title={t('errorTitle')} onRetry={retry} />
            )}
            {!isPending && !isError && gridSize > 0 && (
              <figure className={s.figure}>
                <svg
                  aria-label={t('chartLabel', { map: replay.mapName ?? replay.arenaId ?? '' })}
                  className={s.map}
                  role='img'
                  viewBox={`0 0 ${gridSize} ${gridSize}`}
                >
                  <rect className={s.ground} height={gridSize} width={gridSize} x={0} y={0} />
                  {cells.map((cell) => (
                    <rect key={`${cell.x}-${cell.y}`} className={s.cell} data-level={cell.level} height={1} width={1} x={cell.x} y={cell.y} />
                  ))}
                  {gridLines.map((line) => (
                    <g key={line} className={s.line}>
                      <line x1={line} x2={line} y1={0} y2={gridSize} />
                      <line x1={0} x2={gridSize} y1={line} y2={line} />
                    </g>
                  ))}
                </svg>
                <figcaption className={s.caption}>
                  <span>{samples > 0 ? t('samples', { samples: format.number(samples) }) : t('empty')}</span>
                  <span aria-hidden className={s.legend}>
                    {t('low')}
                    {levels.map((level) => (
                      <span key={level} className={s.swatch} data-level={level} />
                    ))}
                    {t('high')}
                  </span>
                </figcaption>
              </figure>
            )}
          </>
        )}
      </CardBody>
    </Card>
  );
};
