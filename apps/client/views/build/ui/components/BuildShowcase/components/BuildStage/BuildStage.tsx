'use client';

import { ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { vehicleIdentity } from '@/entities/tank/tank';
import { Link } from '@/shared/i18n/navigation';
import { NationBackdrop, TankImage, TierNumeral } from '@/ui-kit';

import type { BuildStageProps } from './BuildStage.types';

import s from './BuildStage.module.scss';

export const BuildStage = ({ vehicle, tanksHref, toggle, left, right, stats, compare, notice, actions }: BuildStageProps) => {
  const t = useTranslations('builds.showcase');
  const tGame = useTranslations('game');

  const tank = vehicleIdentity(vehicle);

  return (
    <section className={s.root} data-theme='dark'>
      <div className={s.toggle}>{toggle}</div>
      <div className={s.left}>{left}</div>
      <div className={s.center}>
        <header className={s.head}>
          <span className={s.eyebrow}>{t('eyebrow')}</span>
          <h1 className={s.title} data-premium={tank.isPremium || undefined}>
            {vehicle.name}
          </h1>
          <nav className={s.path}>
            <Link href={tanksHref.nation}>{tGame(`nations.${tank.nation}`)}</Link>
            <ChevronRight aria-hidden size={14} />
            <Link href={tanksHref.type}>{tGame(`classes.${tank.type}`)}</Link>
            <ChevronRight aria-hidden size={14} />
            <Link href={tanksHref.tier}>
              <TierNumeral tier={tank.tier} />
            </Link>
          </nav>
        </header>
        <div className={s.render}>
          <NationBackdrop className={s.flag} nation={tank.nation} />
          <span aria-hidden className={s.floor} />
          <TankImage isPriority className={s.image} size='big' tank={tank} withTint={false} />
        </div>
        {compare}
      </div>
      <div className={s.right}>
        {right}
        <div className={s.stats}>{stats}</div>
      </div>
      {notice && <div className={s.notice}>{notice}</div>}
      <div className={s.actions}>{actions}</div>
    </section>
  );
};
