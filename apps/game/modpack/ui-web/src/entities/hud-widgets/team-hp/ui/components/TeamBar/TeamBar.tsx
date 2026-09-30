import clsx from 'clsx';

import type { TeamBarProps } from './TeamBar.types';

import { TEAM_HP } from '../../../config';

import s from './TeamBar.module.scss';

export const TeamBar = ({ view, side, color, height, mirrored = false }: TeamBarProps) =>
  view.segmented ? (
    <div className={clsx(s.bar, s.plain, mirrored && s.mirrored)} style={{ width: `${view.barWidth}rem`, height: `${height}rem` }}>
      {side.segments.map((item) =>
        item.kind === 'gap' ? (
          <div key={item.key} className={s.gap} style={{ width: `${TEAM_HP.tierGap}rem` }} />
        ) : (
          <div key={item.key} className={clsx(s.segment, mirrored && s.mirrored, !item.alive && s.dead)} style={{ width: `${item.width}rem` }}>
            <div className={s.fill} style={{ width: `${item.fill}rem`, backgroundColor: color }} />
          </div>
        )
      )}
    </div>
  ) : (
    <div className={clsx(s.bar, mirrored && s.mirrored)} style={{ width: `${view.barWidth}rem`, height: `${height}rem` }}>
      <div className={s.fill} style={{ width: `${side.fill}rem`, backgroundColor: color }} />
    </div>
  );
