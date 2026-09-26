'use client';

import { Shuffle, Warehouse } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { PlusBadge } from '@/features/plus/plus-gate';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, Card, CardHeader, EmptyState } from '@/ui-kit';

import { usePlaylist } from '../../../model/hooks';
import { AnalyticsState } from '../AnalyticsState';
import { PlaylistRow } from './components';

import s from './PlaylistPanel.module.scss';

export const PlaylistPanel = () => {
  const t = useTranslations('analytics.playlist');
  const tState = useTranslations('analytics.state');
  const { items, status, isNoGarage, isExtended, plusSize, isShuffling, retry, shuffle } = usePlaylist();

  return (
    <Card className={s.root} padding='none'>
      <CardHeader
        action={
          <Button disabled={isShuffling || status !== 'ready' || isNoGarage} size='sm' variant='secondary' onClick={shuffle}>
            <Shuffle size={14} />
            {t('shuffle')}
          </Button>
        }
        meta={t('description')}
        title={t('title')}
      />
      <div className={s.body}>
        <AnalyticsState data={status === 'ready' ? items : undefined} isRetrying={isShuffling} status={status} onRetry={retry}>
          {(rows) =>
            isNoGarage || rows.length === 0 ? (
              <EmptyState description={tState('noGarageText')} icon={<Warehouse size={16} />} title={t('empty')} />
            ) : (
              <ol className={s.list}>
                {rows.map((item, index) => (
                  <PlaylistRow key={item.vehicle.tankId} index={index + 1} item={item} />
                ))}
              </ol>
            )
          }
        </AnalyticsState>
        {!isExtended && status === 'ready' && (
          <p className={s.hint}>
            <PlusBadge />
            <span>{t('plusHint', { size: plusSize })}</span>
            <Link className={s.link} href={ROUTES.plus}>
              {t('plusLink')}
            </Link>
          </p>
        )}
      </div>
    </Card>
  );
};
