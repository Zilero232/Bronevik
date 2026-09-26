'use client';

import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { isNotFoundError } from '@/shared/api/source';
import { ROUTES } from '@/shared/constants';
import { DataSourceNote, EmptyState, Skeleton, Tabs } from '@/ui-kit';
import { ResourceMissing } from '@/widgets/resource-missing';

import { useMissionOperation } from '../model/hooks';
import { MissionDetail, MissionList, MissionPlan, OperationHeader } from './components';

import s from './MissionOperationPage.module.scss';

export const MissionOperationPage = () => {
  const t = useTranslations('missions');
  const { detail, branch, branchLabel, mission, totals, isSignedIn, isSaving, progressOf, selectBranch, selectMission, setProgress } =
    useMissionOperation();

  return (
    <div className={s.root}>
      {match(detail)
        .with({ data: P.nonNullable }, ({ data }) => (
          <>
            <OperationHeader data={data} totals={isSignedIn ? totals : null} />
            <Tabs
              items={data.branches.map((item) => ({ value: String(item.chainId), label: branchLabel(item.key), count: item.missions.length }))}
              value={branch ? String(branch.chainId) : undefined}
              variant='strip'
              onValueChange={selectBranch}
            />
            {branch && mission ? (
              <div className={s.layout}>
                <MissionList missions={branch.missions} progressOf={progressOf} selectedId={mission.questId} onSelect={selectMission} />
                <MissionDetail
                  isSaving={isSaving}
                  isSignedIn={isSignedIn}
                  mission={mission}
                  progress={progressOf(mission.questId)}
                  onProgress={setProgress}
                />
              </div>
            ) : (
              <EmptyState title={t('mission.select')} />
            )}
            <MissionPlan operation={data.operation.operationId} />
          </>
        ))
        .with({ isPending: true }, () => <Skeleton height={480} shape='block' />)
        .with({ error: P.when(isNotFoundError) }, () => (
          <ResourceMissing
            back={{ href: ROUTES.missions, label: t('operation.back') }}
            description={t('operation.notFoundDescription')}
            reason='notFound'
            title={t('operation.notFoundTitle')}
          />
        ))
        .otherwise(() => (
          <ResourceMissing
            back={{ href: ROUTES.missions, label: t('operation.back') }}
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
