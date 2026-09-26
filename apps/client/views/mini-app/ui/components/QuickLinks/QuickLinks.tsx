'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';

import type { QuickLinksProps } from './QuickLinks.types';

import { openExternally } from '../../../lib/open-externally';
import { quickLinkTargets } from '../../../lib/quick-links';

import s from './QuickLinks.module.scss';

export const QuickLinks = ({ nickname }: QuickLinksProps) => {
  const t = useTranslations('tg.links');

  return (
    <nav aria-label={t('title')} className={s.root}>
      <span className={s.title}>{t('title')}</span>
      <div className={s.grid}>
        {quickLinkTargets(nickname).map(({ key, href }) => (
          <Link key={key} className={s.link} href={href} onClick={openExternally}>
            <span className={s.label}>{t(key)}</span>
            <ExternalLink className={s.external} size={12} />
          </Link>
        ))}
      </div>
    </nav>
  );
};
