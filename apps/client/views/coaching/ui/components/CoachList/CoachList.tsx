'use client';

import { useTranslations } from 'next-intl';

import { TankPicker } from '@/features/tank/pick-tank';
import { Card, CardHeader, FilteredEmptyState, PagedList } from '@/ui-kit';

import { useCoachList } from '../../../model/hooks';
import { CoachCard } from './components';

import s from './CoachList.module.scss';

export const CoachList = () => {
  const t = useTranslations('coaching.list');
  const { vehicle, list, isFiltered, onVehicleChange, onReset } = useCoachList();

  return (
    <section className={s.root}>
      <Card padding='sm'>
        <CardHeader
          action={<TankPicker className={s.picker} placeholder={t('tankPlaceholder')} value={vehicle} onChange={onVehicleChange} />}
          title={t('title')}
        />
      </Card>
      <PagedList
        empty={
          <Card padding='none'>
            <FilteredEmptyState
              description={isFiltered ? t('emptyFilteredDescription') : t('emptyDescription')}
              isFiltered={isFiltered}
              title={t('emptyTitle')}
              onReset={onReset}
            />
          </Card>
        }
        errorDescription={t('errorDescription')}
        errorTitle={t('errorTitle')}
        getKey={(coach) => coach.userId}
        list={list}
        renderItem={(coach) => <CoachCard coach={coach} />}
        skeletonHeight={140}
      />
    </section>
  );
};
