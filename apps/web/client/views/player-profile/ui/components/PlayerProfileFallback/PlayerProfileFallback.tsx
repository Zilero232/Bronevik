import { ProfileSkeleton } from '../ProfileSkeleton';

import s from './PlayerProfileFallback.module.scss';

export const PlayerProfileFallback = () => (
  <div className={s.root}>
    <ProfileSkeleton />
  </div>
);
