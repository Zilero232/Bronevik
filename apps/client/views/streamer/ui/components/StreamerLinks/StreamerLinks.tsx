'use client';

import { useTranslations } from 'next-intl';

import { buttonVariants } from '@/ui-kit';

import type { StreamerLinksProps } from './StreamerLinks.types';

import { STREAMER_LINK_ICONS } from '../../../config';
import { toStreamerLinks } from '../../../lib/streamer-links';

import s from './StreamerLinks.module.scss';

export const StreamerLinks = ({ links }: StreamerLinksProps) => {
  const t = useTranslations('streamer.page');

  const items = toStreamerLinks(links);

  if (items.length === 0) {
    return null;
  }

  return (
    <nav aria-label={t('channels')} className={s.root}>
      <span className={s.label}>{t('channels')}</span>
      <ul className={s.list}>
        {items.map(({ key, url }) => {
          const Icon = STREAMER_LINK_ICONS[key];

          return (
            <li key={url}>
              <a className={buttonVariants({ variant: 'secondary', size: 'sm' })} href={url} rel='noopener noreferrer me' target='_blank'>
                <Icon size={15} />
                {t(`link.${key}`)}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};
