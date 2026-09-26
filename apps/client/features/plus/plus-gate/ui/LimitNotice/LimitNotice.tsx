'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { LimitNoticeProps } from './LimitNotice.types';

import { useLimitNotice } from '../../model/hooks';

import s from './LimitNotice.module.scss';

export const LimitNotice = ({ limitKey, used, className }: LimitNoticeProps) => {
  const t = useTranslations('plus.limitNotice');
  const { isVisible, isPlus, limit, plusLimit } = useLimitNotice({ limitKey, used });

  if (!isVisible) {
    return null;
  }

  return (
    <p className={clsx(s.root, className)} role='status'>
      <span>{t(isPlus ? 'plus' : 'free', { label: t(`labels.${limitKey}`), used, limit, plusLimit })}</span>
      {!isPlus && (
        <Link className={s.link} href={ROUTES.plus}>
          {t('link')}
        </Link>
      )}
    </p>
  );
};
