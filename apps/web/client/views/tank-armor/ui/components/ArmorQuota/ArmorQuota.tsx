'use client';

import { useTranslations } from 'next-intl';

import { useLoginHref } from '@/entities/auth/session';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { ArmorQuotaProps } from './ArmorQuota.types';

import s from './ArmorQuota.module.scss';

export const ArmorQuota = ({ audience, remaining, limit, freeLimit, resetsOn }: ArmorQuotaProps) => {
  const t = useTranslations('armor.quota');
  const loginHref = useLoginHref();

  return (
    <p className={s.root} data-testid='armor-quota' role='status'>
      <span>{t('remaining', { remaining, limit, date: resetsOn })}</span>
      {audience === 'anonymous' ? (
        <Link className={s.link} href={loginHref}>
          {t('signIn', { count: freeLimit })}
        </Link>
      ) : (
        <Link className={s.link} href={ROUTES.plus}>
          {t('plus')}
        </Link>
      )}
    </p>
  );
};
