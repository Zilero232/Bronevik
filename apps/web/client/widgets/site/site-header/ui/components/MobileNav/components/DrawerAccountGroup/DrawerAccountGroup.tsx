'use client';

import { useTranslations } from 'next-intl';

import type { DrawerAccountGroupProps } from './DrawerAccountGroup.types';

import { useDrawerAccountLinks } from '../../../../../model/hooks';
import { DrawerGroup } from '../DrawerGroup';

export const DrawerAccountGroup = ({ onNavigate }: DrawerAccountGroupProps) => {
  const t = useTranslations('nav.account');
  const { isSignedIn, links, activeHref } = useDrawerAccountLinks();

  if (!isSignedIn) {
    return null;
  }

  return (
    <DrawerGroup activeHref={activeHref} isActive={activeHref !== null} label={t('profile')} links={links} value='account' onNavigate={onNavigate} />
  );
};
