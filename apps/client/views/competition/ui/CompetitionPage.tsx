'use client';

import { useTranslations } from 'next-intl';

import { CompetitionStatusBadge } from '@/entities/competition/competition';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge, buttonVariants, Card, CardBody, CardHeader, EmptyState, ErrorState, PageHeader, Skeleton } from '@/ui-kit';

import type { CompetitionPageProps } from './CompetitionPage.types';

import { COMPETITION_PAGE } from '../config';
import { useCompetition } from '../model/hooks';
import { CompetitionSummary, JoinPanel, OwnerPanel, ScoringRules, StandingsTable } from './components';

import s from './CompetitionPage.module.scss';

export const CompetitionPage = ({ slug }: CompetitionPageProps) => {
  const t = useTranslations('competitions');
  const { competition, isPending, isError, isNotFound, isRetrying, retry } = useCompetition(slug);

  if (isNotFound) {
    return (
      <div className={s.root}>
        <EmptyState
          action={
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.tournaments.points}>
              {t('page.back')}
            </Link>
          }
          description={t('page.notFoundDescription')}
          title={t('page.notFoundTitle')}
        />
      </div>
    );
  }

  if (isError && !competition) {
    return (
      <div className={s.root}>
        <ErrorState description={t('page.errorDescription')} isRetrying={isRetrying} title={t('page.errorTitle')} onRetry={retry} />
      </div>
    );
  }

  if (isPending || !competition) {
    return (
      <div className={s.root}>
        {COMPETITION_PAGE.skeletonHeights.map((height) => (
          <Skeleton key={height} height={height} />
        ))}
      </div>
    );
  }

  return (
    <div className={s.root}>
      <PageHeader
        meta={
          <>
            <CompetitionStatusBadge status={competition.status} />
            {competition.visibility === 'private' && <Badge tone='premium'>{t('visibility.private')}</Badge>}
          </>
        }
        breadcrumbs={[{ label: t('head.title'), href: ROUTES.tournaments.points }, { label: competition.title }]}
        title={competition.title}
      />
      <CompetitionSummary competition={competition} />
      <OwnerPanel competition={competition} />
      <div className={s.grid}>
        <div className={s.main}>
          {competition.description && (
            <Card padding='none'>
              <CardHeader title={t('page.about')} />
              <CardBody>
                <p className={s.description}>{competition.description}</p>
              </CardBody>
            </Card>
          )}
          <StandingsTable competition={competition} />
        </div>
        <aside className={s.side}>
          <JoinPanel competition={competition} />
          <ScoringRules competition={competition} />
        </aside>
      </div>
    </div>
  );
};
