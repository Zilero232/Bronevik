'use client';

import { Crosshair, Link2, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useId } from 'react';
import { match } from 'ts-pattern';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader, EmptyState, ErrorState, KeyFigure, KeyFigures, Skeleton } from '@/ui-kit';

import { useMyHonestRng } from '../../../model/hooks';
import { RngHistogram } from '../RngHistogram';

import s from './MyRngPanel.module.scss';

export const MyRngPanel = () => {
  const t = useTranslations('honestRng.mine');
  const titleId = useId();
  const mine = useMyHonestRng();

  return (
    <section aria-labelledby={titleId} className={s.root}>
      <h2 className={s.title} id={titleId}>
        {t('title')}
      </h2>
      {match(mine.status)
        .with('pending', () => <Skeleton height={240} shape='block' />)
        .with('guest', () => (
          <EmptyState
            action={
              <Link className={buttonVariants({ variant: 'primary', size: 'sm' })} href={mine.loginHref}>
                {t('signIn')}
              </Link>
            }
            description={t('guestText')}
            icon={<LogIn size={16} />}
            title={t('guestTitle')}
          />
        ))
        .with('noAccount', () => (
          <EmptyState
            action={
              <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.overview}>
                {t('link')}
              </Link>
            }
            description={t('noAccountText')}
            icon={<Link2 size={16} />}
            title={t('noAccountTitle')}
          />
        ))
        .with('error', () => (
          <ErrorState isCompact description={t('errorText')} isRetrying={mine.isRetrying} title={t('errorTitle')} onRetry={mine.retry} />
        ))
        .with('empty', () => <EmptyState description={t('emptyText')} icon={<Crosshair size={16} />} title={t('emptyTitle')} />)
        .with('ready', () => (
          <>
            <KeyFigures isFramed>
              <KeyFigure label={t('shots')} tone='steel' value={mine.data?.summary.shots ?? null} />
              <KeyFigure
                format={{ signDisplay: 'exceptZero', maximumFractionDigits: 1 }}
                label={t('meanRoll')}
                suffix='%'
                tone={mine.luckTone}
                value={mine.meanRoll}
              />
              <KeyFigure
                format={{ signDisplay: 'exceptZero', maximumFractionDigits: 1 }}
                hint={t('vsServerHint')}
                label={t('vsServer')}
                suffix='%'
                tone={mine.luckTone}
                value={mine.deltaVsServer}
              />
              <KeyFigure label={t('verdict')} tone={mine.luckTone} value={t(`luck.${mine.data?.luck ?? 'unknown'}`)} />
            </KeyFigures>
            <RngHistogram formatValue={mine.formatPercent} labels={mine.chart.labels} series={mine.chart.series} title={t('chartTitle')} />
            <Card padding='md' variant='well'>
              <CardHeader
                action={
                  <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.analytics}>
                    {t('plusAction')}
                  </Link>
                }
                meta={t('plusText')}
                title={t('plusTitle')}
              />
            </Card>
          </>
        ))
        .exhaustive()}
    </section>
  );
};
