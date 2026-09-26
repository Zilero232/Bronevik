import { clsx } from 'clsx';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { DeltaValue, NationBackdrop, TankImage, TierNumeral } from '@/ui-kit';

import type { TankShowcaseCardProps } from './TankShowcaseCard.types';

import { vehicleIdentity } from '../../lib/vehicle-identity';

import s from './TankShowcaseCard.module.scss';

export const TankShowcaseCard = ({
  vehicle,
  href = ROUTES.tanks.detail(vehicle.slug),
  layout = 'column',
  meta,
  figures = [],
  footer,
  ribbon,
  isPriority = false,
  className
}: TankShowcaseCardProps) => {
  const tank = vehicleIdentity(vehicle);

  return (
    <Link className={clsx(s.root, s[layout], className)} data-class={tank.type} data-premium={tank.isPremium || undefined} href={href}>
      <span className={s.stage}>
        <NationBackdrop nation={tank.nation} />
        <TankImage isDecorative className={s.render} isPriority={isPriority} size='big' tank={tank} withTint={false} />
      </span>
      <TierNumeral className={s.tier} tier={tank.tier} variant='hex' />
      {ribbon}
      <span className={s.body}>
        <span className={s.name}>{tank.name}</span>
        {meta && <span className={s.meta}>{meta}</span>}
        {figures.length > 0 && (
          <span className={s.figures}>
            {figures.map(({ id, label, value, delta, isDeltaLowerBetter }) => (
              <span key={id} className={s.figure}>
                <span className={s.figureLabel}>{label}</span>
                <span className={s.figureValue}>
                  {value}
                  {delta !== undefined && delta !== null && <DeltaValue isLowerBetter={isDeltaLowerBetter} value={delta} />}
                </span>
              </span>
            ))}
          </span>
        )}
        {footer && <span className={s.footer}>{footer}</span>}
      </span>
    </Link>
  );
};
