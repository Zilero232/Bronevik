'use client';

import { Link2, UserPlus } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, EmptyState, KeyFigure, QueryState, Skeleton } from '@/ui-kit';
import { SocialShell } from '@/widgets/social/social-shell';

import { LEAGUE_VIEW } from '../config';
import { useLeague } from '../model/hooks';
import { DivisionCard, LeagueStanding, LeagueTable, LeagueToolbar } from './components';

import s from './LeaguesPage.module.scss';

export const LeaguesPage = () => {
  const t = useTranslations('social.leagues');
  const league = useLeague();

  return (
    <SocialShell
      figures={
        league.standing?.me && (
          <>
            <KeyFigure label={t('figures.place')} value={league.standing.me.value === null ? '—' : league.standing.me.rank} variant='compact' />
            <KeyFigure label={t('figures.circle')} value={league.entries.length} variant='compact' />
          </>
        )
      }
      section='leagues'
    >
      <div className={s.root}>
        <LeagueToolbar
          metric={league.metric}
          metricOptions={league.params.metricOptions}
          nav={league.nav}
          scope={league.params.scope}
          scopeOptions={league.params.scopeOptions}
          weekStart={league.weekStart}
          onMetricChange={league.params.onMetricChange}
          onNext={league.onNext}
          onPrevious={league.onPrevious}
          onScopeChange={league.params.onScopeChange}
        />
        <QueryState
          empty={
            league.isFriends ? (
              <EmptyState
                action={
                  <Link className={buttonVariants({ variant: 'primary', size: 'sm' })} href={ROUTES.players.list}>
                    <UserPlus aria-hidden size={14} />
                    {t('empty.action')}
                  </Link>
                }
                description={t('empty.description')}
                title={t('empty.title')}
              />
            ) : (
              <EmptyState
                action={
                  <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.overview}>
                    <Link2 aria-hidden size={14} />
                    {t('pending.action')}
                  </Link>
                }
                description={t('pending.description')}
                title={t('pending.title')}
              />
            )
          }
          errorDescription={t('error.description')}
          errorTitle={t('error.title')}
          isEmpty={(data) => (data.scope === 'division' ? data.division === null : data.entries.length === 0)}
          query={league.query}
          skeleton={<Skeleton height={LEAGUE_VIEW.skeletonHeight} shape='block' />}
        >
          {league.division && <DivisionCard division={league.division} />}
          {league.standing && <LeagueStanding metric={league.metric} standing={league.standing} />}
          <LeagueTable entries={league.entries} metric={league.metric} scope={league.params.scope} />
        </QueryState>
      </div>
    </SocialShell>
  );
};
