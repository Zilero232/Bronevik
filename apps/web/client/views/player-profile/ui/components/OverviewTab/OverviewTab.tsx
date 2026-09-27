import { ActivityPanel, FavoriteTanksPanel, HighlightStats, MarksPanel, PeriodRatingsPanel } from './components';

import s from './OverviewTab.module.scss';

export const OverviewTab = () => (
  <div className={s.root}>
    <HighlightStats />
    <FavoriteTanksPanel />
    <MarksPanel />
    <div className={s.grid}>
      <PeriodRatingsPanel />
      <ActivityPanel />
    </div>
  </div>
);
