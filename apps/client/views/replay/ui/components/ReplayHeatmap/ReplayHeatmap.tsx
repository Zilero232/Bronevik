'use client';

import { useFormatter, useTranslations } from 'next-intl';
import { useId } from 'react';

import { Card, CardBody, CardHeader, EmptyState, QueryState, Skeleton } from '@/ui-kit';

import { useReplay } from '../../../model/context';
import { useReplayHeatmap } from '../../../model/hooks';
import { HeatmapControls } from './components';

import s from './ReplayHeatmap.module.scss';

export const ReplayHeatmap = () => {
  const t = useTranslations('replays.heatmap');
  const replay = useReplay();
  const titleId = useId();
  const format = useFormatter();
  const { hasArena, hasReplayMode, modeChoice, scope, levels, query, setModeChoice, setScope } = useReplayHeatmap();

  return (
    <Card aria-labelledby={titleId} padding='none'>
      <CardHeader meta={replay.mapName ?? replay.arenaId} title={<span id={titleId}>{t('title')}</span>} />
      <CardBody className={s.body}>
        {!hasArena && <EmptyState isCompact description={t('noArenaDescription')} title={t('noArenaTitle')} />}
        {hasArena && (
          <>
            <HeatmapControls
              hasReplayMode={hasReplayMode}
              modeChoice={modeChoice}
              scope={scope}
              onModeChoiceChange={setModeChoice}
              onScopeChange={setScope}
            />
            <QueryState
              isCompact
              errorDescription={t('errorDescription')}
              errorTitle={t('errorTitle')}
              isEmpty={({ gridSize }) => gridSize === 0}
              query={query}
              skeleton={<Skeleton className={s.map} shape='block' />}
            >
              {({ gridSize, samples, cells, gridLines }) => (
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
            </QueryState>
          </>
        )}
      </CardBody>
    </Card>
  );
};
