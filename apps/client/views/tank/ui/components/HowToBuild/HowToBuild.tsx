'use client';

import { BUILD_USAGE } from '@otmetki/schemas';
import { useTranslations } from 'next-intl';
import { match } from 'ts-pattern';

import { PlusBadge, PlusGate, PlusTeaser } from '@/features/plus/plus-gate';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants, Card, CardHeader, EmptyState, ErrorState, SegmentedControl, Skeleton } from '@/ui-kit';

import { HOW_TO_BUILD, TANK_SECTIONS } from '../../../config';
import { useHowToBuild } from '../../../model/hooks';
import { BuildHistory, UsageBody } from './components';

import s from './HowToBuild.module.scss';

export const HowToBuild = () => {
  const t = useTranslations('tank.builds');
  const {
    mode,
    cohort,
    setMode,
    setCohort,
    modes,
    cohorts,
    plusCohorts,
    isLocked,
    usage,
    crew,
    hasLoadout,
    href,
    isPending,
    isError,
    isFetching,
    onRetry
  } = useHowToBuild();

  return (
    <Card className={s.root} id={TANK_SECTIONS.builds} padding='none'>
      <CardHeader
        action={
          hasLoadout ? (
            <Link className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={href}>
              {t('open')}
            </Link>
          ) : undefined
        }
        className={s.header}
        title={t('title')}
      />
      <div className={s.controls}>
        <SegmentedControl
          aria-label={t('modeLabel')}
          options={modes.map((value) => ({ value, label: t(`modes.${value}`) }))}
          size='sm'
          value={mode}
          onChange={setMode}
        />
        <SegmentedControl
          aria-label={t('cohortLabel')}
          options={cohorts.map((value) => ({ value, label: t(`cohorts.${value}`), icon: plusCohorts.has(value) ? <PlusBadge /> : undefined }))}
          size='sm'
          value={cohort}
          onChange={setCohort}
        />
        {usage && !isLocked && (
          <span className={s.sample}>{t('sample', { battles: usage.battles, players: usage.players, days: usage.windowDays })}</span>
        )}
      </div>
      {match({ isLocked, isPending, isError, usage })
        .with({ isLocked: true }, () => <PlusTeaser className={s.body} feature='analytics' />)
        .with({ isPending: true }, () => (
          <div className={s.body}>
            <Skeleton height={HOW_TO_BUILD.skeletonHeight} shape='block' width='100%' />
          </div>
        ))
        .with({ isError: true }, () => <ErrorState isRetrying={isFetching} title={t('errorTitle')} onRetry={onRetry} />)
        .with({ usage: { isEnough: true } }, ({ usage: loaded }) => <UsageBody crew={crew} usage={loaded} />)
        .otherwise(() => (
          <EmptyState
            description={t('emptyDescription', { min: usage?.minSample ?? BUILD_USAGE.minSample, battles: usage?.battles ?? 0 })}
            title={t('emptyTitle')}
          />
        ))}
      <PlusGate fallback={null} feature='analytics'>
        <BuildHistory cohort={cohort} mode={mode} />
      </PlusGate>
      <p className={s.note}>{t('note')}</p>
    </Card>
  );
};
