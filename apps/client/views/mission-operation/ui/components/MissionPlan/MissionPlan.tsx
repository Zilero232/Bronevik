'use client';

import { useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge, buttonVariants, Card, CardBody, CardHeader, EmptyState, QueryState, Skeleton } from '@/ui-kit';

import type { MissionPlanProps } from './MissionPlan.types';

import { useMissionPlan } from '../../../model/hooks';

import s from './MissionPlan.module.scss';

export const MissionPlan = ({ operation }: MissionPlanProps) => {
  const t = useTranslations('missions');
  const { branchLabel, query, isSignedIn, needsPlus } = useMissionPlan(operation);

  return (
    <Card padding='none'>
      <CardHeader meta={query.data && t('plan.remaining', { count: query.data.remaining })} title={t('plan.title')} />
      <CardBody className={s.body}>
        <p className={s.description}>{t('plan.description')}</p>
        {!isSignedIn && <p className={s.muted}>{t('plan.signIn')}</p>}
        {isSignedIn && needsPlus && (
          <EmptyState
            isCompact
            action={
              <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={ROUTES.plus}>
                {t('plan.plusAction')}
              </Link>
            }
            description={t('plan.plusDescription')}
            title={t('plan.plusTitle')}
          />
        )}
        {isSignedIn && !needsPlus && (
          <QueryState
            isCompact
            empty={<EmptyState isCompact title={t('plan.empty')} />}
            errorTitle={t('plan.errorTitle')}
            isEmpty={({ steps }) => steps.length === 0}
            query={query}
            skeleton={<Skeleton height={120} shape='block' />}
          >
            {(plan) => (
              <ol className={s.steps}>
                {plan.steps.map((step) => (
                  <li key={`${step.questId}-${step.withHonors}`} className={s.step}>
                    <Badge tone='steel'>{branchLabel(step.branchKey)}</Badge>
                    <span className={s.title}>{step.title}</span>
                    {step.withHonors && <Badge tone='accent'>{t('mission.withHonors')}</Badge>}
                    {step.tank && <TankCell image='contour' vehicle={step.tank} />}
                  </li>
                ))}
              </ol>
            )}
          </QueryState>
        )}
      </CardBody>
    </Card>
  );
};
