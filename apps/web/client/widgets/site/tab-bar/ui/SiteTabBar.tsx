'use client';

import * as m from 'motion/react-m';
import { useTranslations } from 'next-intl';

import { CommandPaletteTrigger } from '@/features/search/command-palette';
import { Link } from '@/shared/i18n/navigation';
import { MOTION_TRANSITION } from '@/shared/lib';

import { TAB_BAR } from '../config';
import { useTabBar } from '../model/hooks';

import s from './SiteTabBar.module.scss';

export const SiteTabBar = () => {
  const t = useTranslations('nav.tabBar');
  const { activeKey } = useTabBar();

  return (
    <>
      <div aria-hidden className={s.spacer} />
      <nav aria-label={t('label')} className={s.root}>
        <ul className={s.list}>
          {TAB_BAR.tabs.map((tab) => (
            <li key={tab.key}>
              {'href' in tab ? (
                <Link aria-current={activeKey === tab.key ? 'page' : undefined} className={s.tab} data-active={activeKey === tab.key} href={tab.href}>
                  {activeKey === tab.key && (
                    <m.span aria-hidden className={s.indicator} layoutId={TAB_BAR.indicatorId} transition={MOTION_TRANSITION.base} />
                  )}
                  <tab.icon aria-hidden size={TAB_BAR.iconSize} />
                  <span>{t(tab.key)}</span>
                </Link>
              ) : (
                <CommandPaletteTrigger className={s.tab} variant='tab' />
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};
