'use client';

import { clsx } from 'clsx';
import { CircleHelp } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';

import type { RatingsMethodLinkProps } from './RatingsMethodLink.types';

import { RATINGS_METHOD_LINK } from '../../config';

import s from './RatingsMethodLink.module.scss';

export const RatingsMethodLink = ({ section, isIconOnly = false, className }: RatingsMethodLinkProps) => {
  const t = useTranslations('methodology.link');

  return (
    <Link
      aria-label={isIconOnly ? t('label') : undefined}
      className={clsx(s.root, className)}
      href={section ? `${ROUTES.ratings}#${section}` : ROUTES.ratings}
      title={t('label')}
    >
      <CircleHelp aria-hidden size={RATINGS_METHOD_LINK.iconSize} />
      {!isIconOnly && <span>{t('text')}</span>}
    </Link>
  );
};
