import {
  ClanActivity,
  CommunityBand,
  ForYou,
  GameNews,
  GarageStrip,
  HomeActions,
  HomeHero,
  MarksMovement,
  StrongTanks,
  TopPlayers
} from './components';

import s from './HomePage.module.scss';

export const HomePage = () => (
  <div className={s.root}>
    <div className={s.head}>
      <HomeHero />
      <HomeActions />
    </div>
    <ForYou />
    <StrongTanks />
    <GarageStrip />
    <MarksMovement />
    <TopPlayers />
    <div className={s.pair}>
      <GameNews />
      <ClanActivity />
    </div>
    <CommunityBand />
  </div>
);
