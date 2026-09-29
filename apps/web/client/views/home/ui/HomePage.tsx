import { Band } from '@/ui-kit';

import {
  ClanActivity,
  CommunityBand,
  ForYou,
  GameNews,
  GarageStrip,
  HomeActions,
  HomeHero,
  MarksMovement,
  ModpackPromo,
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
    <Band as='div' isDark={false} tone='raised' width='full'>
      <StrongTanks />
    </Band>
    <GarageStrip />
    <MarksMovement />
    <ModpackPromo />
    <Band as='div' isDark={false} texture='noise' tone='raised' width='full'>
      <TopPlayers />
    </Band>
    <div className={s.pair}>
      <GameNews />
      <ClanActivity />
    </div>
    <CommunityBand />
  </div>
);
