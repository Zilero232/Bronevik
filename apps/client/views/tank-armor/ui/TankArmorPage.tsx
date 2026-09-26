'use client';

import { Box } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { match, P } from 'ts-pattern';

import { useArmorModel } from '@/entities/armor/armor-model';
import { isNotFoundError } from '@/shared/api/source';
import { EmptyState, ErrorState } from '@/ui-kit';
import { ArmorViewer } from '@/widgets/armor/armor-viewer';

import type { TankArmorParams } from './TankArmorPage.types';

import { ArmorAttribution, ArmorHeader, ArmorLoading } from './components';

import s from './TankArmorPage.module.scss';

export const TankArmorPage = () => {
  const t = useTranslations('armor.states');
  const { slug } = useParams<TankArmorParams>();
  const { data: model, isPending, error, isRefetching, refetch } = useArmorModel(slug);

  return (
    <div className={s.root}>
      <ArmorHeader name={model?.response.vehicle.name} slug={slug} version={model?.response.gameVersion} />
      {match({ model, isPending, error })
        .with({ model: P.nonNullable }, ({ model: loaded }) => <ArmorViewer model={loaded} slug={slug} />)
        .with({ isPending: true }, () => <ArmorLoading />)
        .with({ error: P.when(isNotFoundError) }, () => (
          <EmptyState description={t('emptyDescription')} icon={<Box size={36} strokeWidth={1.5} />} title={t('emptyTitle')} />
        ))
        .otherwise(() => (
          <ErrorState description={t('errorDescription')} isRetrying={isRefetching} title={t('errorTitle')} onRetry={() => void refetch()} />
        ))}
      <ArmorAttribution commit={model?.response.source.commit} />
    </div>
  );
};
