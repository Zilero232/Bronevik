'use client';

import { useTranslations } from 'next-intl';

import { TankCell } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Badge, buttonVariants, Card, CardBody, CardHeader, EmptyState, ErrorState, Skeleton } from '@/ui-kit';

import type { MissionPlanProps } from './MissionPlan.types';

import { useMissionPlan } from '../../../model/hooks';

import s from './MissionPlan.module.scss';

export const MissionPlan = ({ operation }: MissionPlanProps) => {
  const t = useTranslations('missions');
  const { branchLabel, plan, isSignedIn, isPending, needsPlus, isError, isRetrying, retry } = useMissionPlan(operation);

  return (
    <Card padding='none'>
      <CardHeader meta={plan && t('plan.remaining', { count: plan.remaining })} title={t('plan.title')} />
      <CardBody className={s.body}>
        <p className={s.description}>{t('plan.description')}</p>
        {!isSignedIn && <p className={s.muted}>{t('plan.signIn')}</p>}
        {needsPlus && (
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
        {isError && <ErrorState isCompact isRetrying={isRetrying} title={t('plan.errorTitle')} onRetry={retry} />}
        {isPending && <Skeleton height={120} shape='block' />}
        {plan?.steps.length === 0 && <EmptyState isCompact title={t('plan.empty')} />}
        {plan && plan.steps.length > 0 && (
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
      </CardBody>
    </Card>
  );
};
