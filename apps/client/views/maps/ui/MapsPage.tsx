'use client';

import { useTranslations } from 'next-intl';

import { DataSourceNote, PageHeader, Tabs } from '@/ui-kit';
import { MapRotationPanel } from '@/widgets/map/map-rotation';

import { useMapsTab } from '../model/hooks';
import { MapsCatalog } from './components';

import s from './MapsPage.module.scss';

export const MapsPage = () => {
  const t = useTranslations('maps');
  const tabs = useTranslations('mapStats.tabs');
  const { tab, setTab } = useMapsTab();

  return (
    <div className={s.root}>
      <PageHeader description={t('head.description')} title={t('head.title')} />
      <Tabs
        items={[
          { value: 'catalog', label: tabs('catalog'), content: <MapsCatalog /> },
          { value: 'rotation', label: tabs('rotation'), content: <MapRotationPanel /> }
        ]}
        aria-label={tabs('label')}
        value={tab}
        variant='panel'
        onValueChange={setTab}
      />
      <DataSourceNote />
    </div>
  );
};
