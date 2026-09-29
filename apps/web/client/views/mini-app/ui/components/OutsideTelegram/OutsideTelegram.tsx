'use client';

import { ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { TELEGRAM_BOT } from '@/shared/config';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import { OutsideNotice } from '../OutsideNotice';

import s from './OutsideTelegram.module.scss';

export const OutsideTelegram = () => {
  const t = useTranslations('tg.outside');

  return (
    <OutsideNotice description={t('description', { bot: `@${TELEGRAM_BOT.username}` })} title={t('title')}>
      <div className={s.actions}>
        <a className={buttonVariants({ block: true })} href={TELEGRAM_BOT.url} rel='noreferrer' target='_blank'>
          {t('open')}
          <ExternalLink size={14} />
        </a>
        <Link className={buttonVariants({ variant: 'ghost', block: true })} href={ROUTES.home}>
          {t('site')}
        </Link>
      </div>
    </OutsideNotice>
  );
};
