'use client';

import { Link2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader, EmptyState, KeyFigure, QueryState, Skeleton } from '@/ui-kit';
import { SocialShell } from '@/widgets/social/social-shell';

import { CHALLENGES_VIEW } from '../config';
import { useWeeklyChallenges } from '../model/hooks';
import { ChallengeCard, ChallengeTimeLeft } from './components';

import s from './ChallengesPage.module.scss';

export const ChallengesPage = () => {
  const t = useTranslations('social.challenges');
  const { query, rows, summary, needsLesta, endsAt } = useWeeklyChallenges();

  return (
    <SocialShell
      figures={
        summary && (
          <>
            <KeyFigure label={t('figures.completed')} value={t('figures.completedOf', summary)} variant='compact' />
            {endsAt && <ChallengeTimeLeft endsAt={endsAt} />}
          </>
        )
      }
      section='challenges'
    >
      <div className={s.root}>
        {needsLesta && (
          <Card padding='md' variant='well'>
            <CardHeader
              action={
                <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.account.overview}>
                  <Link2 aria-hidden size={14} />
                  {t('lesta.action')}
                </Link>
              }
              meta={t('lesta.text')}
              title={t('lesta.title')}
            />
          </Card>
        )}
        <QueryState
          skeleton={
            <div className={s.grid}>
              {Array.from({ length: CHALLENGES_VIEW.skeletonCards }, (_, index) => (
                <Skeleton key={index} height={CHALLENGES_VIEW.skeletonHeight / 2} shape='block' />
              ))}
            </div>
          }
          empty={<EmptyState description={t('empty.description')} title={t('empty.title')} />}
          errorDescription={t('error.description')}
          errorTitle={t('error.title')}
          isEmpty={({ challenges }) => challenges.length === 0}
          query={query}
        >
          <h2 className={s.srOnly}>{t('listTitle')}</h2>
          <ul className={s.grid}>
            {rows.map((row) => (
              <li key={row.code}>
                <ChallengeCard row={row} />
              </li>
            ))}
          </ul>
        </QueryState>
      </div>
    </SocialShell>
  );
};
