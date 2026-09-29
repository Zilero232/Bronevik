import clsx from 'clsx';

import type { TeamBarProps } from './TeamBar.types';

import s from './TeamBar.module.scss';

export const TeamBar = ({ view, side, color, height, mirrored = false }: TeamBarProps) =>
  view.segmented ? (
    <div className={clsx(s.bar, s.plain, mirrored && s.mirrored)} style={{ width: `${view.barWidth}rem`, height: `${height}rem` }}>
      {side.segments.map((segment) => (
        <div key={segment.key} className={clsx(s.segment, mirrored && s.mirrored, !segment.alive && s.dead)} style={{ width: `${segment.width}rem` }}>
          <div className={s.fill} style={{ width: `${segment.fill}rem`, backgroundColor: color }} />
        </div>
      ))}
    </div>
  ) : (
    <div className={clsx(s.bar, mirrored && s.mirrored)} style={{ width: `${view.barWidth}rem`, height: `${height}rem` }}>
      <div className={s.fill} style={{ width: `${side.fill}rem`, backgroundColor: color }} />
    </div>
  );
