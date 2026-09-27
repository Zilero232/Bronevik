'use client';

import { useTranslations } from 'next-intl';

import { Tabs } from '@/ui-kit';

import type { BuildView } from '../../../model/hooks';

import { useBuildView } from '../../../model/hooks';
import { BuildShowcase } from '../BuildShowcase';
import { BuildWorkspace } from '../BuildWorkspace';

import s from './BuildScreen.module.scss';

export const BuildScreen = () => {
  const t = useTranslations('builds.showcase.tabs');
  const { view, onViewChange } = useBuildView();

  return (
    <Tabs<BuildView>
      items={[
        { value: 'showcase', label: t('showcase'), content: <BuildShowcase /> },
        { value: 'editor', label: t('editor'), content: <BuildWorkspace /> }
      ]}
      className={s.root}
      value={view}
      onValueChange={onViewChange}
    />
  );
};
