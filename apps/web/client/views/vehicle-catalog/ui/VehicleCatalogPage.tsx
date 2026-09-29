'use client';

import { HeavyTankIcon } from '@otmetki/icons';
import { useTranslations } from 'next-intl';

import { CatalogPending } from '@/entities/tank/tank';
import { ROUTES } from '@/shared/constants';
import { Card, DataSourceNote, FilteredEmptyState, PageHero, QueryState, Skeleton } from '@/ui-kit';

import { VEHICLE_CATALOG_VIEW } from '../config';
import { useVehicleCatalogPage } from '../model/hooks';
import { CatalogFilters, TierSection } from './components';

import s from './VehicleCatalogPage.module.scss';

export const VehicleCatalogPage = () => {
  const t = useTranslations('vehicleCatalog');
  const { query, isFiltered, onReset } = useVehicleCatalogPage();

  return (
    <div className={s.root}>
      <PageHero
        art={{ kind: 'emblem', glyph: <HeavyTankIcon size={VEHICLE_CATALOG_VIEW.emblemSize} strokeWidth={VEHICLE_CATALOG_VIEW.emblemStroke} /> }}
        breadcrumbs={[{ label: t('head.home'), href: ROUTES.home }, { label: t('head.title') }]}
        lead={t('head.description')}
        title={t('head.title')}
      />
      <div className={s.content}>
        <CatalogFilters />
        <QueryState
          empty={
            <Card>
              {isFiltered ? (
                <FilteredEmptyState isFiltered description={t('empty.description')} title={t('empty.title')} onReset={onReset} />
              ) : (
                <CatalogPending />
              )}
            </Card>
          }
          skeleton={
            <div aria-busy className={s.skeleton}>
              {VEHICLE_CATALOG_VIEW.skeletons.map((index) => (
                <Skeleton key={index} height={VEHICLE_CATALOG_VIEW.skeletonHeight} shape='block' />
              ))}
            </div>
          }
          errorDescription={t('error.description')}
          errorTitle={t('error.title')}
          isEmpty={(data) => data.shown === 0}
          query={query}
        >
          {(data) => (
            <div className={s.tiers}>
              {data.groups.map((group) => (
                <TierSection key={group.tier} group={group} />
              ))}
            </div>
          )}
        </QueryState>
        <DataSourceNote />
      </div>
    </div>
  );
};
