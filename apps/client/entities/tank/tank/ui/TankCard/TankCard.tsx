import { clsx } from 'clsx';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { TankImage } from '@/ui-kit';

import type { TankCardProps } from './TankCard.types';

import { vehicleIdentity } from '../../lib/vehicle-identity';
import { TankIdentity } from '../TankIdentity';
import { WinRateCell } from '../WinRateCell';

import s from './TankCard.module.scss';

export const TankCard = ({ row, className }: TankCardProps) => {
  const t = useTranslations('stats');
  const format = useFormatter();

  const { vehicle, winRate, avgDamage, battles } = row;
  const tank = vehicleIdentity(vehicle);

  return (
    <Link className={clsx(s.root, className)} href={ROUTES.tank(vehicle.slug)}>
      <TankImage isDecorative className={s.render} size='big' tank={tank} />
      <TankIdentity className={s.identity} tank={tank} withNation={false} />
      <dl className={s.metrics}>
        <div className={s.metric}>
          <dt>{t('winRate')}</dt>
          <dd>
            <WinRateCell value={winRate} />
          </dd>
        </div>
        <div className={s.metric}>
          <dt>{t('avgDamage')}</dt>
          <dd>{format.number(avgDamage, { maximumFractionDigits: 0 })}</dd>
        </div>
        <div className={s.metric}>
          <dt>{t('battles')}</dt>
          <dd>{format.number(battles, { notation: 'compact' })}</dd>
        </div>
      </dl>
    </Link>
  );
};
