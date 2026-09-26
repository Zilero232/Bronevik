'use client';

import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';
import { ROUTES } from '@/shared/constants';
import { DataSourceNote, EmptyState, Skeleton } from '@/ui-kit';
import { ResourceMissing } from '@/widgets/resource-missing';

import { useMissionOperation } from '../model/hooks';
import { BranchBoard, MissionDetail, MissionPlan, OperationHeader } from './components';

import s from './MissionOperationPage.module.scss';

export const MissionOperationPage = () => {
  const t = useTranslations('missions');
  const { detail, columns, mission, totals, isSignedIn, isTracked, isSaving, progressOf, selectMission, setProgress } = useMissionOperation();

  return (
    <div className={s.root}>
      {match(detail)
        .with({ data: P.nonNullable }, ({ data }) => (
          <>
            <OperationHeader data={data} totals={isSignedIn ? totals : null} />
            <BranchBoard columns={columns} isTracked={isTracked} selectedId={mission?.questId ?? null} onSelect={selectMission} />
            {mission ? (
              <MissionDetail
                isSaving={isSaving}
                isSignedIn={isSignedIn}
                mission={mission}
                progress={progressOf(mission.questId)}
                onProgress={setProgress}
              />
            ) : (
              <EmptyState title={t('mission.select')} />
            )}
            <MissionPlan operation={data.operation.operationId} />
          </>
        ))
        .with({ isPending: true }, () => <Skeleton height={480} shape='block' />)
        .with({ error: P.when(isNotFoundError) }, () => (
          <ResourceMissing
            back={{ href: ROUTES.missions.hub, label: t('operation.back') }}
            description={t('operation.notFoundDescription')}
            reason='notFound'
            title={t('operation.notFoundTitle')}
          />
        ))
        .otherwise(() => (
          <ResourceMissing
            back={{ href: ROUTES.missions.hub, label: t('operation.back') }}
            description={t('operation.errorDescription')}
            isRetrying={detail.isFetching}
            reason='error'
            title={t('operation.errorTitle')}
            onRetry={() => void detail.refetch()}
          />
        ))}
      <DataSourceNote />
    </div>
  );
};
