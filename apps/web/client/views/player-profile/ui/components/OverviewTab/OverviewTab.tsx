import { AchievementShelf, ActivityPanel, CareerPanel, FavoriteTanksPanel, HighlightStats, MarksPanel, PeriodRatingsPanel } from './components';

import s from './OverviewTab.module.scss';

export const OverviewTab = () => (
  <div className={s.root}>
    <HighlightStats />
    <FavoriteTanksPanel />
    <MarksPanel />
    <AchievementShelf />
    <CareerPanel />
    <div className={s.grid}>
      <PeriodRatingsPanel />
      <ActivityPanel />
    </div>
  </div>
);
