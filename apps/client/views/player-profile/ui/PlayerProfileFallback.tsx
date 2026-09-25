import { ProfileSkeleton } from './components';

import s from './PlayerProfilePage.module.scss';

export const PlayerProfileFallback = () => (
  <div className={s.root}>
    <ProfileSkeleton />
  </div>
);
