import clsx from 'clsx';

import type { TeamCenterProps } from './TeamCenter.types';

import { toneClass } from '../../../../../../shared/ui/hud';

import s from './TeamCenter.module.scss';

export const TeamCenter = ({ view }: TeamCenterProps) =>
  view.hasCenter ? (
    <div className={s.center}>
      <div className={s.top}>
        {view.score && (
          <>
            <span>{view.score.allies}</span>
            <span className={s.colon}>:</span>
            <span>{view.score.enemies}</span>
          </>
        )}
      </div>
      {view.secondRow && <span className={clsx(s.bottom, toneClass(view.diffTone))}>{view.diff}</span>}
    </div>
  ) : (
    <div className={s.split} />
  );
