'use client';

import { HeavyTankSilhouetteIcon } from '@bronevik/icons';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { AnimatedNumber, buttonVariants, PageHero, Skeleton } from '@/ui-kit';

import { summarizeStats } from '../../../lib/stats-summary';
import { useTankStats } from '../../../model/hooks';

import s from './TanksHero.module.scss';

export const TanksHero = () => {
  const t = useTranslations('tanks.hero');
  const format = useFormatter();
  const { data } = useTankStats();

  const summary = summarizeStats(data?.items ?? []);
  const { strongest } = summary;

  return (
    <PageHero
      aside={
        <dl className={s.readouts}>
          <div className={s.readout}>
            <dt>{t('tanks')}</dt>
            <dd>{data ? <AnimatedNumber value={data.total} /> : <Skeleton width={60} />}</dd>
          </div>
          <div className={s.readout}>
            <dt>{t('battles')}</dt>
            <dd>{data ? <AnimatedNumber format={{ notation: 'compact' }} value={summary.battles} /> : <Skeleton width={80} />}</dd>
          </div>
          <div data-wide className={s.readout}>
            <dt>{t('strongest')}</dt>
            <dd>
              {strongest ? (
                <Link className={s.leader} href={ROUTES.tank(strongest.vehicle.slug)}>
                  {strongest.vehicle.name}
                  <span className={s.diff}>{format.number(strongest.winRateDiff, { maximumFractionDigits: 2, signDisplay: 'always' })}</span>
                </Link>
              ) : data ? (
                <span className={s.none}>{t('noLeader')}</span>
              ) : (
                <Skeleton width={140} />
              )}
            </dd>
          </div>
        </dl>
      }
      description={t('description')}
      eyebrow={t('eyebrow')}
      index='// 04'
      title={t('title')}
      watermark={<HeavyTankSilhouetteIcon size={220} strokeWidth={0.5} />}
    >
      <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.compareTanks}>
        {t('compare')}
      </Link>
      <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={ROUTES.tree}>
        {t('tree')}
      </Link>
    </PageHero>
  );
};
