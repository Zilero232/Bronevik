'use client';

import { useTranslations } from 'next-intl';

import { TournamentStatusBadge } from '@/features/community/tournament-status';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardBody, CardHeader, EmptyState, ErrorState, PageHeader, Skeleton } from '@/ui-kit';

import type { TournamentPageProps } from './TournamentPage.types';

import { useTournament } from '../model/hooks';
import { OrganizerPanel, ParticipantsTable, RegistrationPanel, TournamentBracket, TournamentSummary } from './components';

import s from './TournamentPage.module.scss';

export const TournamentPage = ({ slug }: TournamentPageProps) => {
  const t = useTranslations('tournaments');
  const { tournament, isPending, isError, isNotFound, isRetrying, retry } = useTournament(slug);

  if (isNotFound) {
    return (
      <div className={s.root}>
        <EmptyState
          action={
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.tournaments.list}>
              {t('page.back')}
            </Link>
          }
          description={t('page.notFoundDescription')}
          title={t('page.notFoundTitle')}
        />
      </div>
    );
  }

  if (isError && !tournament) {
    return (
      <div className={s.root}>
        <ErrorState description={t('page.errorDescription')} isRetrying={isRetrying} title={t('page.errorTitle')} onRetry={retry} />
      </div>
    );
  }

  if (isPending || !tournament) {
    return (
      <div className={s.root}>
        <Skeleton height={72} />
        <Skeleton height={240} />
      </div>
    );
  }

  return (
    <div className={s.root}>
      <PageHeader
        breadcrumbs={[{ label: t('head.title'), href: ROUTES.tournaments.list }, { label: tournament.title }]}
        meta={<TournamentStatusBadge status={tournament.status} />}
        title={tournament.title}
      />
      <TournamentSummary tournament={tournament} />
      <OrganizerPanel tournament={tournament} />
      <div className={s.grid}>
        <div className={s.main}>
          {tournament.description && (
            <Card padding='none'>
              <CardHeader title={t('page.about')} />
              <CardBody>
                <p className={s.description}>{tournament.description}</p>
              </CardBody>
            </Card>
          )}
          <TournamentBracket tournament={tournament} />
        </div>
        <aside className={s.side}>
          <RegistrationPanel tournament={tournament} />
          <ParticipantsTable tournament={tournament} />
        </aside>
      </div>
    </div>
  );
};
