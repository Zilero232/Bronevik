import { TANK_CLASS_ICONS, toRoman } from '@otmetki/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { TankImage, vehicleIdentity, WinRateCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { ShowcaseCardProps } from './ShowcaseCard.types';

import { tierBand } from '../../../../../lib/tier-band';

import s from './ShowcaseCard.module.scss';

export const ShowcaseCard = ({ row, isPriority = false }: ShowcaseCardProps) => {
  const t = useTranslations('home.strongTanks');
  const tGame = useTranslations('game');
  const format = useFormatter();
  const tank = vehicleIdentity(row.vehicle);
  const ClassIcon = TANK_CLASS_ICONS[tank.type];

  return (
    <Link
      className={s.root}
      data-class={tank.type}
      data-nation={tank.nation}
      data-premium={tank.isPremium || undefined}
      data-tier-band={tierBand(tank.tier)}
      href={ROUTES.tanks.detail(row.vehicle.slug)}
    >
      <span className={s.stage}>
        <TankImage isDecorative className={s.render} isPriority={isPriority} size='big' tank={tank} />
      </span>
      <span className={s.tier}>{toRoman(tank.tier)}</span>
      <span className={s.body}>
        <span className={s.name}>{tank.name}</span>
        <span className={s.kind}>
          <ClassIcon aria-hidden size={14} variant={tank.isPremium ? 'premium' : 'regular'} />
          {tGame(`classes.${tank.type}`)}
        </span>
      </span>
      <span className={s.figures}>
        <span className={s.figure}>
          <span className={s.label}>{t('winRate')}</span>
          <WinRateCell className={s.value} digits={1} value={row.winRate} />
        </span>
        <span className={s.figure}>
          <span className={s.label}>{t('damage')}</span>
          <span className={s.value}>{format.number(row.avgDamage, { maximumFractionDigits: 0 })}</span>
        </span>
        <span className={s.figure}>
          <span className={s.label}>{t('battles')}</span>
          <span className={s.value}>{format.number(row.battles, { notation: 'compact', maximumFractionDigits: 1 })}</span>
        </span>
      </span>
    </Link>
  );
};
