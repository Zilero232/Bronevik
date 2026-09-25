'use client';

import { MonitorSmartphone, Smartphone } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { MiniAppCardProps } from './MiniAppCard.types';

import { botLink } from '../../../lib/bot-link';

import s from './MiniAppCard.module.scss';

export const MiniAppCard = ({ botUsername }: MiniAppCardProps) => {
  const t = useTranslations('telegram.miniApp');

  return (
    <aside className={s.root}>
      <div aria-hidden className={s.phone}>
        <Smartphone size={40} strokeWidth={1.25} />
      </div>
      <span className={s.eyebrow}>{t('eyebrow')}</span>
      <h2 className={s.title}>{t('title')}</h2>
      <p className={s.description}>{t('description')}</p>
      <div className={s.actions}>
        <a className={buttonVariants({ block: true })} href={botLink({ username: botUsername })} rel='noreferrer' target='_blank'>
          {t('open')}
        </a>
        <Link className={buttonVariants({ variant: 'ghost', block: true })} href={ROUTES.miniApp}>
          <MonitorSmartphone size={16} />
          {t('preview')}
        </Link>
      </div>
    </aside>
  );
};
