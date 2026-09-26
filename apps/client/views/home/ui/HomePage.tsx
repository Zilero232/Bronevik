import { ClanActivity, GameNews, GarageStrip, HomeHead, MarksMovement, StrongTanks, TopPlayers } from './components';

import s from './HomePage.module.scss';

export const HomePage = () => (
  <div className={s.root}>
    <HomeHead />
    <GarageStrip />
    <div className={s.tables}>
      <StrongTanks />
      <TopPlayers />
      <MarksMovement />
    </div>
    <div className={s.pair}>
      <GameNews />
      <ClanActivity />
    </div>
  </div>
);
