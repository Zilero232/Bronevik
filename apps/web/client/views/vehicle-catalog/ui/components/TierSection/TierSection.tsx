import { toRoman } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import type { TierSectionProps } from './TierSection.types';

import { VehicleTile } from '../VehicleTile';

import s from './TierSection.module.scss';

export const TierSection = ({ group: { tier, vehicles } }: TierSectionProps) => {
  const t = useTranslations('vehicleCatalog');

  return (
    <section aria-label={t('tier', { tier })} className={s.root}>
      <header className={s.head}>
        <span aria-hidden className={s.numeral}>
          {toRoman(tier)}
        </span>
        <h2 className={s.title}>{t('tier', { tier })}</h2>
        <span className={s.count}>{t('tierCount', { count: vehicles.length })}</span>
      </header>
      <ul className={s.grid}>
        {vehicles.map((vehicle) => (
          <VehicleTile key={vehicle.tankId} vehicle={vehicle} />
        ))}
      </ul>
    </section>
  );
};
