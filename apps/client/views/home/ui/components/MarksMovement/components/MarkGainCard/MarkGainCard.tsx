import { Mark1Icon, Mark2Icon, Mark3Icon } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { DeltaValue } from '@/ui-kit';

import type { MarkGainCardProps } from './MarkGainCard.types';

import s from './MarkGainCard.module.scss';

export const MarkGainCard = ({ row }: MarkGainCardProps) => {
  const t = useTranslations('home.marks');
  const format = useFormatter();
  const tank = vehicleIdentity(row.vehicle);
  const delta = row.trend.p95Delta30d;

  return (
    <Link className={s.root} data-nation={tank.nation} href={ROUTES.tanks.detail(row.vehicle.slug)}>
      <span className={s.stage}>
        <TankImage isDecorative className={s.render} size='big' tank={tank} />
      </span>
      <span className={s.body}>
        <span className={s.name} data-premium={tank.isPremium || undefined}>
          {tank.name}
        </span>
        <span className={s.label}>{t('threeMarks')}</span>
        <span className={s.value}>
          <Mark3Icon aria-hidden size={20} />
          {row.moe ? format.number(row.moe.p95) : '—'}
        </span>
        {delta !== null && (
          <span className={s.delta}>
            <DeltaValue isLowerBetter value={delta} />
            <span className={s.period}>{t('period')}</span>
          </span>
        )}
        {row.moe && (
          <span className={s.steps}>
            <span className={s.step}>
              <Mark1Icon aria-hidden size={14} />
              <span className={s.srOnly}>{t('oneMark')}</span>
              {format.number(row.moe.p65)}
            </span>
            <span className={s.step}>
              <Mark2Icon aria-hidden size={14} />
              <span className={s.srOnly}>{t('twoMarks')}</span>
              {format.number(row.moe.p85)}
            </span>
          </span>
        )}
      </span>
    </Link>
  );
};
