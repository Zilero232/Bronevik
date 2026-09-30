import clsx from 'clsx';

import type { TeamCenterProps } from './TeamCenter.types';

import s from './TeamCenter.module.scss';

export const TeamCenter = ({ view, blank = false }: TeamCenterProps) => (
  <div className={view.hasCenter ? s.center : s.split}>
    {!blank && view.score !== null && <span className={s.score}>{view.score}</span>}
    {!blank && view.diff !== null && <span className={clsx(s.diff, view.diffAhead ? s.ahead : s.behind)}>{`Δ ${view.diff}`}</span>}
  </div>
);
