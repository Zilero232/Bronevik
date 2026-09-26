'use client';

import { Info } from 'lucide-react';
import { useFormatter, useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Card, CardHeader, DataSourceNote, ErrorState, Skeleton, Sparkline, Tooltip } from '@/ui-kit';

import { useServerStatus } from '../../../../../model/hooks';

import s from './StatusPanel.module.scss';

export const StatusPanel = () => {
  const t = useTranslations('home.status');
  const format = useFormatter();
  const status = useServerStatus();

  return (
    <Card className={s.root} padding='none'>
      <CardHeader
        action={
          <Link className={s.more} href={ROUTES.pulse}>
            {t('pulse')}
          </Link>
        }
        title={t('title')}
      />
      {status.isPending && <Skeleton className={s.body} height={96} shape='block' />}
      {status.isError && <ErrorState isCompact onRetry={status.retry} />}
      {!status.isPending && !status.isError && (
        <dl className={s.body}>
          <div className={s.row}>
            <dt>{t('versionNumber')}</dt>
            <dd>{status.version ?? t('unknown')}</dd>
          </div>
          <div className={s.row}>
            <dt>{t('version')}</dt>
            <dd>{status.releasedAt ? format.dateTime(new Date(status.releasedAt), { dateStyle: 'medium' }) : t('unknown')}</dd>
          </div>
          {status.online === null ? (
            <div className={s.row}>
              <dt className={s.term}>
                {t('activeEstimate')}
                <Tooltip content={t('estimateHint')}>
                  <span aria-label={t('estimateHint')} className={s.info} role='img'>
                    <Info size={12} />
                  </span>
                </Tooltip>
              </dt>
              <dd>{status.activePlayers === null ? t('unknown') : `≈ ${format.number(status.activePlayers)}`}</dd>
            </div>
          ) : (
            <div className={s.row}>
              <dt>{t('online')}</dt>
              <dd>{format.number(status.online)}</dd>
            </div>
          )}
          <div className={s.row}>
            <dt>{t('tracked')}</dt>
            <dd>{status.trackedPlayers === null ? t('unknown') : format.number(status.trackedPlayers)}</dd>
          </div>
          {status.activity.length > 0 && <Sparkline className={s.spark} data={status.activity} label={t('activity')} />}
          <DataSourceNote updatedAt={status.updatedAt} />
        </dl>
      )}
    </Card>
  );
};
