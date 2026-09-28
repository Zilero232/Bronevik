import { ActivityPanel, CareerPanel, FavoriteTanksPanel, HighlightStats, MarksPanel, PeriodRatingsPanel } from './components';

import s from './OverviewTab.module.scss';

export const OverviewTab = () => (
  <div className={s.root}>
    <HighlightStats />
    <FavoriteTanksPanel />
    <MarksPanel />
    <CareerPanel />
    <div className={s.grid}>
      <PeriodRatingsPanel />
      <ActivityPanel />
    </div>
  </div>
);
