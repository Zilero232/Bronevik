import { FirstWinPanel } from '../FirstWinPanel';
import { PlaylistPanel } from '../PlaylistPanel';

import s from './TodayTab.module.scss';

export const TodayTab = () => (
  <div className={s.root}>
    <PlaylistPanel />
    <FirstWinPanel />
  </div>
);
