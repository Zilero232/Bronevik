import { PlayersHero, PopularPlayers, RecentPlayers } from './components';

import s from './PlayersPage.module.scss';

export const PlayersPage = () => (
  <div className={s.root}>
    <PlayersHero />
    <div className={s.sections}>
      <RecentPlayers />
      <PopularPlayers />
    </div>
  </div>
);
