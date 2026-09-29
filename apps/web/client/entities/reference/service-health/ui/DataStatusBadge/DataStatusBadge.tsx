'use client';

import { clsx } from 'clsx';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { DataStatusBadgeProps } from './DataStatusBadge.types';

import { useServiceHealth } from '../../model/hooks';

import s from './DataStatusBadge.module.scss';

export const DataStatusBadge = ({ className }: DataStatusBadgeProps) => {
  const t = useTranslations('status.badge');
  const {
    summary: { verdict, status }
  } = useServiceHealth();

  return (
    <Link className={clsx(s.root, className)} data-status={status} href={ROUTES.status} title={t(`hint.${verdict}`)}>
      <span aria-hidden className={s.dot} />
      <span className={s.label}>{t(`label.${verdict}`)}</span>
    </Link>
  );
};
