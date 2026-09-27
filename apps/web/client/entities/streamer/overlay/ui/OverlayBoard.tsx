'use client';

import { clsx } from 'clsx';

import type { OverlayBoardProps } from './OverlayBoard.types';

import { readOverlayMetric } from '../lib/overlay-metric';
import { ChallengePlate, LastBattlePlate, MetricPlate, MoePlate } from './components';

import s from './OverlayBoard.module.scss';

export const OverlayBoard = ({ data, config, className }: OverlayBoardProps) => {
  const { theme, layout, metrics, accentColor, fontScale, animate, showTank } = config;
  const { session, moe, challenge } = data;
  const lastBattle = session?.lastBattle ?? null;

  return (
    <div
      className={clsx(s.root, className)}
      data-layout={layout}
      data-skin={theme}
      style={{ '--color-accent': accentColor, '--overlay-scale': fontScale }}
    >
      {metrics.map((metric) => {
        if (metric === 'moePercent') {
          return moe && <MoePlate key={metric} animate={animate} moe={moe} scale={fontScale} showTank={showTank} />;
        }

        if (metric === 'lastBattle') {
          return lastBattle && <LastBattlePlate key={metric} animate={animate} battle={lastBattle} showTank={showTank} />;
        }

        return <MetricPlate key={metric} animate={animate} reading={readOverlayMetric({ data, metric })} />;
      })}
      {challenge && <ChallengePlate challenge={challenge} />}
    </div>
  );
};
