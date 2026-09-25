'use client';

import { useTanksState } from '../model/hooks';
import { StatsControls, StatsTable, TanksHero, TierList } from './components';

import s from './TanksPage.module.scss';

export const TanksPage = () => {
  const [{ view }] = useTanksState();

  return (
    <div className={s.root}>
      <TanksHero />
      <StatsControls />
      {view === 'table' ? <StatsTable /> : <TierList />}
    </div>
  );
};
