import { clsx } from 'clsx';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { NationBackdrop, TankImage, TierNumeral } from '@/ui-kit';

import type { TankShowcaseCardProps } from './TankShowcaseCard.types';

import { vehicleIdentity } from '../../lib/vehicle-identity';

import s from './TankShowcaseCard.module.scss';

export const TankShowcaseCard = ({
  vehicle,
  href = ROUTES.tanks.detail(vehicle.slug),
  figures = [],
  footer,
  ribbon,
  className
}: TankShowcaseCardProps) => {
  const tank = vehicleIdentity(vehicle);

  return (
    <Link className={clsx(s.root, className)} data-class={tank.type} data-premium={tank.isPremium || undefined} href={href}>
      <span className={s.stage}>
        <NationBackdrop nation={tank.nation} />
        <TankImage isDecorative className={s.render} size='big' tank={tank} withTint={false} />
      </span>
      <TierNumeral className={s.tier} tier={tank.tier} variant='hex' />
      {ribbon}
      <span className={s.name}>{tank.name}</span>
      {figures.length > 0 && (
        <span className={s.figures}>
          {figures.map((figure) => (
            <span key={figure.id} className={s.figure}>
              <span className={s.figureLabel}>{figure.label}</span>
              <span className={s.figureValue}>{figure.value}</span>
            </span>
          ))}
        </span>
      )}
      {footer && <span className={s.footer}>{footer}</span>}
    </Link>
  );
};
