'use client';

import { useTranslations } from 'next-intl';

import { TankIdentity, TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { EmptyState, SectionHeader } from '@/ui-kit';

import { useTree } from '../../../model/context';

import s from './PremiumStrip.module.scss';

export const PremiumStrip = () => {
  const t = useTranslations('tree.premiums');
  const { premiums } = useTree();

  return (
    <section className={s.root}>
      <SectionHeader description={t('description')} title={t('title')} />
      {premiums.length === 0 ? (
        <EmptyState isCompact title={t('empty')} />
      ) : (
        <ul className={s.grid}>
          {premiums.map(({ vehicle }) => (
            <li key={vehicle.tankId}>
              <Link className={s.slot} href={ROUTES.tanks.detail(vehicle.slug)}>
                <TankImage isDecorative className={s.render} size='big' tank={vehicleIdentity(vehicle)} />
                <TankIdentity tank={vehicleIdentity(vehicle)} withNation={false} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};
