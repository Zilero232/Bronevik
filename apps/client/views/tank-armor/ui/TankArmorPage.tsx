'use client';

import { Box } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { useArmorModel } from '@/entities/armor/armor-model';
import { isNotFoundError } from '@/shared/api/source';
import { useRouteParam } from '@/shared/lib';
import { EmptyState, QueryState } from '@/ui-kit';
import { ArmorViewer } from '@/widgets/armor/armor-viewer';

import { ArmorAttribution, ArmorHeader, ArmorLoading } from './components';

import s from './TankArmorPage.module.scss';

export const TankArmorPage = () => {
  const t = useTranslations('armor.states');
  const slug = useRouteParam('slug');
  const query = useArmorModel(slug);

  return (
    <div className={s.root}>
      <ArmorHeader
        client={query.data?.response.source.client}
        name={query.data?.response.vehicle.name}
        slug={slug}
        version={query.data?.response.gameVersion}
      />
      <QueryState
        errorState={
          isNotFoundError(query.error) ? (
            <EmptyState description={t('emptyDescription')} icon={<Box size={36} strokeWidth={1.5} />} title={t('emptyTitle')} />
          ) : undefined
        }
        errorDescription={t('errorDescription')}
        errorTitle={t('errorTitle')}
        query={query}
        skeleton={<ArmorLoading />}
      >
        {(model) => <ArmorViewer model={model} slug={slug} />}
      </QueryState>
      <ArmorAttribution commit={query.data?.response.source.commit} />
    </div>
  );
};
