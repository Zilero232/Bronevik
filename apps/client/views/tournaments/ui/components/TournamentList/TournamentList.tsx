'use client';

import { useFormatter, useTranslations } from 'next-intl';

import { RequirementsList } from '@/features/community/stat-requirements';
import { TournamentStatusBadge } from '@/features/community/tournament-status';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, Card, CardHeader, EmptyState, ErrorState, SegmentedControl, Skeleton } from '@/ui-kit';

import { TOURNAMENT_FILTERS, TOURNAMENT_LIST } from '../../../config';
import { useTournamentList } from '../../../model/hooks';

import s from './TournamentList.module.scss';

export const TournamentList = () => {
  const t = useTranslations('tournaments');
  const format = useFormatter();
  const { filter, items, isPending, isError, isRetrying, hasNextPage, isFetchingNextPage, onFilterChange, loadMore, retry } = useTournamentList();

  return (
    <Card padding='none'>
      <CardHeader
        action={
          <SegmentedControl
            aria-label={t('list.filter')}
            options={TOURNAMENT_FILTERS.map((value) => ({ value, label: value === 'all' ? t('list.all') : t(`status.${value}`) }))}
            size='sm'
            value={filter}
            onChange={onFilterChange}
          />
        }
        title={t('list.title')}
      />
      {isError && items.length === 0 && (
        <ErrorState isCompact description={t('list.errorDescription')} isRetrying={isRetrying} title={t('list.errorTitle')} onRetry={retry} />
      )}
      {!isError && isPending && (
        <div className={s.skeletons}>
          <Skeleton height={56} />
          <Skeleton height={56} />
        </div>
      )}
      {!isPending && !isError && items.length === 0 && <EmptyState isCompact description={t('list.emptyDescription')} title={t('list.emptyTitle')} />}
      {items.length > 0 && (
        <ul className={s.list}>
          {items.map((tournament) => (
            <li key={tournament.id} className={s.row}>
              <div className={s.main}>
                <Link className={s.title} href={ROUTES.tournament(tournament.slug)}>
                  {tournament.title}
                </Link>
                <RequirementsList requirements={tournament.requirements} />
              </div>
              <TournamentStatusBadge status={tournament.status} />
              <span className={s.date}>{format.dateTime(new Date(tournament.startsAt), TOURNAMENT_LIST.dateFormat)}</span>
              <span className={s.count}>{t('list.participants', { count: tournament.participants.length, max: tournament.maxParticipants })}</span>
            </li>
          ))}
        </ul>
      )}
      {hasNextPage && (
        <div className={s.more}>
          <Button disabled={isFetchingNextPage} size='sm' variant='secondary' onClick={loadMore}>
            {t('list.more')}
          </Button>
        </div>
      )}
    </Card>
  );
};
