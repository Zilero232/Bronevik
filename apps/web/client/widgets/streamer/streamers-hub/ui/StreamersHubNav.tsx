'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import { useStreamersHub } from '../model/hooks';

import s from './StreamersHubNav.module.scss';

export const StreamersHubNav = () => {
  const t = useTranslations('streamersDirectory.hub');
  const items = useStreamersHub();

  return (
    <nav aria-label={t('label')} className={s.root}>
      {items.map((item) => (
        <Link key={item.key} aria-current={item.isActive ? 'page' : undefined} className={s.link} data-active={item.isActive} href={item.href}>
          <item.icon aria-hidden size={16} />
          {t(item.key)}
        </Link>
      ))}
    </nav>
  );
};
