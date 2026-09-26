import { ActivityPanel, FavoriteTanksPanel, MarksPanel, PeriodRatingsPanel } from './components';

import s from './OverviewTab.module.scss';

export const OverviewTab = () => (
  <div className={s.root}>
    <FavoriteTanksPanel />
    <MarksPanel />
    <PeriodRatingsPanel />
    <ActivityPanel />
  </div>
);
