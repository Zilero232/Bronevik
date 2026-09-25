import { FeatureGrid, HomeHero, HotTanks, LiveCounters, MarksShowcase, TopPlayers } from './components';

import s from './HomePage.module.scss';

export const HomePage = () => (
  <div className={s.root}>
    <HomeHero />
    <div className={s.sections}>
      <LiveCounters />
      <FeatureGrid />
      <TopPlayers />
      <HotTanks />
      <MarksShowcase />
    </div>
  </div>
);
