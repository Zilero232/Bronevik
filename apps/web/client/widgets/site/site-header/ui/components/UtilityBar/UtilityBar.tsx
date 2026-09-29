'use client';

import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Suspense } from 'react';

import { DataStatusBadge } from '@/entities/reference/service-health';
import { LocaleSwitcher } from '@/features/app/switch-locale';
import { ThemeToggle } from '@/features/app/switch-theme';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import { DisplaySettings } from '../DisplaySettings';
import { GameStatusSlot } from '../GameStatusSlot';

import s from './UtilityBar.module.scss';

export const UtilityBar = () => {
  const t = useTranslations('nav.utility');

  return (
    <div className={s.root} data-theme='dark'>
      <div className={s.inner}>
        <section aria-label={t('label')} className={s.status}>
          <GameStatusSlot />
          <DataStatusBadge />
        </section>
        <div className={s.settings}>
          <Link className={s.link} href={ROUTES.mod}>
            <Download aria-hidden size={14} />
            {t('mod')}
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
