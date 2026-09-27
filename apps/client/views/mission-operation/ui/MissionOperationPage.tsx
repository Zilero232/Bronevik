'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { DataSourceNote, Skeleton } from '@/ui-kit';
import { ResourceGate } from '@/widgets/resource-missing';

import { useOperationDetail } from '../model/hooks';
import { BranchBoard, MissionDetail, MissionPlan, OperationHeader } from './components';

import s from './MissionOperationPage.module.scss';

export const MissionOperationPage = () => {
  const t = useTranslations('missions');
  const detail = useOperationDetail();

  return (
    <div className={s.root}>
      <ResourceGate
        back={{ href: ROUTES.missions.hub, label: t('operation.back') }}
        error={{ title: t('operation.errorTitle'), description: t('operation.errorDescription') }}
        notFound={{ title: t('operation.notFoundTitle'), description: t('operation.notFoundDescription') }}
        query={detail}
        skeleton={<Skeleton height={480} shape='block' />}
      >
        {(data) => (
          <>
            <OperationHeader data={data} />
            <BranchBoard />
            <MissionDetail />
            <MissionPlan operation={data.operation.operationId} />
          </>
        )}
      </ResourceGate>
      <DataSourceNote />
    </div>
  );
};
