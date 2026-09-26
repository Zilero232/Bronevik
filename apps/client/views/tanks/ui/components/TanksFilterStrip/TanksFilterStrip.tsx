import { useTranslations } from 'next-intl';

import { VehicleFilters } from '@/features/tank/filter-vehicles';

import s from './TanksFilterStrip.module.scss';

export const TanksFilterStrip = () => {
  const t = useTranslations('tanks.hero');

  return (
    <section aria-label={t('filters')} className={s.root} data-theme='dark'>
      <div className={s.inner}>
        <VehicleFilters className={s.filters} />
      </div>
    </section>
  );
};
