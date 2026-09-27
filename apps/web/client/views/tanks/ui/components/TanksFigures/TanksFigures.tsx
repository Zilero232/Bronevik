'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { TankImage, vehicleIdentity } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { KeyFigure, KeyFigures } from '@/ui-kit';

import { TANKS_VIEW } from '../../../config';
import { useTanksFigures } from '../../../model/hooks';

import s from './TanksFigures.module.scss';

export const TanksFigures = () => {
  const t = useTranslations('tanks.head');
  const format = useFormatter();
  const { total, summary, isPending } = useTanksFigures();

  const { strongest } = summary;

  return (
    <KeyFigures>
      <KeyFigure label={t('tanks')} value={isPending ? null : total} />
      <KeyFigure format={TANKS_VIEW.compactNumber} label={t('battles')} value={isPending ? null : summary.battles} />
      <div className={s.leader}>
        <span className={s.label}>{t('strongest')}</span>
        {strongest ? (
          <Link className={s.link} href={ROUTES.tanks.detail(strongest.vehicle.slug)}>
            <TankImage isDecorative size='small' tank={vehicleIdentity(strongest.vehicle)} />
            <span className={s.name} data-premium={strongest.vehicle.isPremium}>
              {strongest.vehicle.shortName}
            </span>
            <span className={s.diff}>{format.number(strongest.winRateDiff, { maximumFractionDigits: 2, signDisplay: 'always' })}</span>
          </Link>
        ) : (
          <span className={s.none}>{t('noLeader')}</span>
        )}
      </div>
    </KeyFigures>
  );
};
