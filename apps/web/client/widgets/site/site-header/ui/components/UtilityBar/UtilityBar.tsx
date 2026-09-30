'use client';

import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { DataStatusBadge } from '@/entities/reference/service-health';
import { LocaleSwitcher } from '@/features/app/switch-locale';
import { ThemeToggle } from '@/features/app/switch-theme';
import { OwnPlayerMenu } from '@/features/player/own-nickname';
import { SITE_NAV } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import { DisplaySettings } from '../DisplaySettings';
import { GameStatusSlot } from '../GameStatusSlot';

import s from './UtilityBar.module.scss';

export const UtilityBar = () => {
  const t = useTranslations('nav');

  return (
    <div className={s.root}>
      <div className={s.inner}>
        <section aria-label={t('utility.label')} className={s.status}>
          <GameStatusSlot isServiceShown={false} />
          <DataStatusBadge />
        </section>
        <div className={s.settings}>
          <OwnPlayerMenu />
          <Link className={s.link} href={SITE_NAV.hub.href}>
            <SITE_NAV.hub.icon aria-hidden size={14} />
            {t('allSections')}
          </Link>
          <Suspense>
            <LocaleSwitcher />
          </Suspense>
          <ThemeToggle />
          <DisplaySettings />
        </div>
      </div>
    </div>
  );
};
