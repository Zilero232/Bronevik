'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import type { SocialNavProps } from './SocialNav.types';

import { SOCIAL_SECTIONS } from '../../../../config';

import s from './SocialNav.module.scss';

export const SocialNav = ({ section }: SocialNavProps) => {
  const t = useTranslations('social.shell');

  return (
    <nav aria-label={t('label')} className={s.root}>
      {SOCIAL_SECTIONS.map((item) => (
        <Link
          key={item.key}
          aria-current={item.key === section ? 'page' : undefined}
          className={s.link}
          data-active={item.key === section}
          href={item.href}
        >
          <item.icon aria-hidden className={s.icon} size={16} />
          {t(`sections.${item.key}.title`)}
        </Link>
      ))}
    </nav>
  );
};
