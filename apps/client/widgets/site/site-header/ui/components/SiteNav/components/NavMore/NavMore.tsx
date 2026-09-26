'use client';

import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { SITE_NAV_COMMUNITY, SITE_NAV_MORE } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Popover } from '@/ui-kit';

import s from './NavMore.module.scss';

export const NavMore = () => {
  const t = useTranslations('nav');

  return (
    <Popover
      trigger={
        <button className={s.trigger} type='button'>
          {t('more')}
          <ChevronDown aria-hidden size={14} />
        </button>
      }
      align='start'
    >
      <ul className={s.list}>
        {SITE_NAV_MORE.map((item) => (
          <li key={item.key}>
            <Link className={s.link} href={item.href}>
              {t(item.key)}
            </Link>
          </li>
        ))}
      </ul>
      <span className={s.heading}>{t('community')}</span>
      <ul className={s.list}>
        {SITE_NAV_COMMUNITY.map((item) => (
          <li key={item.key}>
            <Link className={s.link} href={item.href}>
              {t(item.key)}
            </Link>
          </li>
        ))}
      </ul>
    </Popover>
  );
};
