'use client';

import { useTranslations } from 'next-intl';

import { PlusGate } from '@/features/plus/plus-gate';
import { VehicleFilters } from '@/features/tank/filter-vehicles';
import { ActionStrip } from '@/ui-kit';

import { useTanksState } from '../model/hooks';
import { EconomyTable, MyEconomy, StatsControls, StatsTable, TanksHero, TierList } from './components';

import s from './TanksPage.module.scss';

export const TanksPage = () => {
  const t = useTranslations('tanks');
  const [{ view }] = useTanksState();

  return (
    <div className={s.root}>
      <div className={s.head}>
        <TanksHero />
        <ActionStrip aria-label={t('hero.filters')} as='section' start={<VehicleFilters className={s.filters} />} />
      </div>
      <div className={s.body}>
        <StatsControls />
        {view === 'table' && <StatsTable />}
        {view === 'tierlist' && <TierList />}
        {view === 'economy' && (
          <>
            <PlusGate feature='analytics'>
              <MyEconomy />
            </PlusGate>
            <EconomyTable />
          </>
        )}
        <p className={s.source}>{t('source')}</p>
      </div>
    </div>
  );
};
