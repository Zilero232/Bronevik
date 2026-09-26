'use client';

import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { Button, Card, CardHeader, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import { useCoachList } from '../../../model/hooks';
import { CoachCard } from './components';

import s from './CoachList.module.scss';

export const CoachList = () => {
  const t = useTranslations('coaching.list');
  const { vehicle, items, isFiltered, isPending, isError, isRetrying, hasNextPage, isFetchingNextPage, onVehicleChange, onReset, loadMore, retry } =
    useCoachList();

  return (
    <section className={s.root}>
      <Card padding='sm'>
        <CardHeader
          action={<TankPicker className={s.picker} placeholder={t('tankPlaceholder')} value={vehicle} onChange={onVehicleChange} />}
          title={t('title')}
        />
      </Card>
      {isError && items.length === 0 && (
        <ErrorState description={t('errorDescription')} isRetrying={isRetrying} title={t('errorTitle')} onRetry={retry} />
      )}
      {!isError && isPending && (
        <div className={s.list}>
          <Skeleton height={140} />
          <Skeleton height={140} />
        </div>
      )}
      {!isPending && !isError && items.length === 0 && (
        <Card padding='none'>
          <EmptyState
            action={
              isFiltered && (
                <Button size='sm' variant='secondary' onClick={onReset}>
                  {t('reset')}
                </Button>
              )
            }
            description={isFiltered ? t('emptyFilteredDescription') : t('emptyDescription')}
            title={t('emptyTitle')}
          />
        </Card>
      )}
      {items.length > 0 && (
        <ul className={s.list}>
          {items.map((coach) => (
            <li key={coach.userId}>
              <CoachCard coach={coach} />
            </li>
          ))}
        </ul>
      )}
      {hasNextPage && (
        <Button className={s.more} disabled={isFetchingNextPage} size='sm' variant='secondary' onClick={loadMore}>
          {t('more')}
        </Button>
      )}
    </section>
  );
};
