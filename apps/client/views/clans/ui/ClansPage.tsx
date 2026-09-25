'use client';

import { ClanRating, ClansHero } from './components';

import s from './ClansPage.module.scss';

export const ClansPage = () => (
  <div className={s.root}>
    <ClansHero />
    <div className={s.sections}>
      <ClanRating />
    </div>
  </div>
);
