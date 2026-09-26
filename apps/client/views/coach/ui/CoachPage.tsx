'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Avatar, Badge, buttonVariants, Card, CardBody, CardHeader, EmptyState, ErrorState, PageHeader, Skeleton } from '@/ui-kit';

import type { CoachPageProps } from './CoachPage.types';

import { useCoach } from '../model/hooks';
import { CoachContacts, CoachOffers, CoachRequestForm, CoachSummary, CoachTanks } from './components';

import s from './CoachPage.module.scss';

export const CoachPage = ({ userId }: CoachPageProps) => {
  const t = useTranslations('coaching');
  const { coach, vehicles, contacts, offers, profileHref, isPending, isError, isNotFound, isRetrying, retry } = useCoach(userId);

  if (isNotFound) {
    return (
      <div className={s.root}>
        <EmptyState
          action={
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.coaching.list}>
              {t('coach.back')}
            </Link>
          }
          description={t('coach.notFoundDescription')}
          title={t('coach.notFoundTitle')}
        />
      </div>
    );
  }

  if (isError && !coach) {
    return (
      <div className={s.root}>
        <ErrorState description={t('coach.errorDescription')} isRetrying={isRetrying} title={t('coach.errorTitle')} onRetry={retry} />
      </div>
    );
  }

  if (isPending || !coach) {
    return (
      <div className={s.root}>
        <Skeleton height={96} />
        <Skeleton height={240} />
      </div>
    );
  }

  return (
    <div className={s.root}>
      <PageHeader
        title={
          <span className={s.title}>
            <Avatar name={coach.name} size='lg' src={coach.image ?? undefined} />
            {coach.name}
          </span>
        }
        breadcrumbs={[{ label: t('head.title'), href: ROUTES.coaching.list }, { label: coach.name }]}
        description={coach.headline}
        meta={!coach.isActive && <Badge tone='neutral'>{t('coach.inactive')}</Badge>}
      />
      <div className={s.grid}>
        <div className={s.main}>
          <CoachSummary coach={coach} profileHref={profileHref} />
          {coach.bio && (
            <Card padding='none'>
              <CardHeader title={t('coach.about')} />
              <CardBody>
                <p className={s.bio}>{coach.bio}</p>
              </CardBody>
            </Card>
          )}
          {vehicles.length > 0 && <CoachTanks vehicles={vehicles} />}
          <CoachOffers offers={offers} />
        </div>
        <aside className={s.side}>
          <CoachContacts contacts={contacts} />
          <CoachRequestForm coach={coach} />
        </aside>
      </div>
    </div>
  );
};
