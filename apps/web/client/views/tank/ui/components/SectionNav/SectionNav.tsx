'use client';

import { useTranslations } from 'next-intl';

import { Tabs } from '@/ui-kit';

import { useSectionNav } from '../../../model/hooks';

import s from './SectionNav.module.scss';

export const SectionNav = () => {
  const t = useTranslations('tank.nav');
  const { items, active, onSelect } = useSectionNav();

  return <Tabs aria-label={t('label')} className={s.root} items={items} value={active} variant='sticky' onValueChange={onSelect} />;
};
