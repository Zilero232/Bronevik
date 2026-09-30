import type { SetBadgesProps } from './SetBadges.types';

import s from './SetBadges.module.scss';

export const SetBadges = ({ sets }: SetBadgesProps) => (
  <div className={s.sets}>
    {sets.map((set) => (
      <span key={set.group} className={s.badge}>
        {set.text}
      </span>
    ))}
  </div>
);
