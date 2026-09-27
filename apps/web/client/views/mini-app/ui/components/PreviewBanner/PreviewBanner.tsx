'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TELEGRAM_BOT } from '@/shared/config';

import s from './PreviewBanner.module.scss';

export const PreviewBanner = () => {
  const t = useTranslations('tg.preview');

  return (
    <aside className={s.root}>
      <p className={s.text}>{t('text')}</p>
      <a className={s.link} href={TELEGRAM_BOT.url} rel='noreferrer' target='_blank'>
        {t('open')}
        <ExternalLink size={12} />
      </a>
    </aside>
  );
};
