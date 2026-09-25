'use client';

import { Award, Calculator, ExternalLink, LayoutDashboard, UserRound } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { QuickLinksProps } from './QuickLinks.types';

import { QUICK_LINKS } from '../../../config';
import { openExternally } from '../../../lib/open-externally';

import s from './QuickLinks.module.scss';

export const QuickLinks = ({ nickname }: QuickLinksProps) => {
  const t = useTranslations('tg.links');

  const targets = {
    profile: { href: ROUTES.player(nickname), icon: UserRound },
    marks: { href: ROUTES.marks, icon: Award },
    account: { href: ROUTES.me, icon: LayoutDashboard },
    tools: { href: ROUTES.tools, icon: Calculator }
  } as const;

  return (
    <nav aria-label={t('title')} className={s.root}>
      <span className={s.title}>{t('title')}</span>
      <div className={s.grid}>
        {QUICK_LINKS.map((key) => {
          const { href, icon: Icon } = targets[key];

          return (
            <Link key={key} className={s.link} href={href} onClick={openExternally}>
              <Icon className={s.icon} size={20} />
              <span className={s.label}>{t(key)}</span>
              <ExternalLink className={s.external} size={12} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
