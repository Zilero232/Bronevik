'use client';

import { ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import type { ArmorHeaderProps } from './ArmorHeader.types';

import s from './ArmorHeader.module.scss';

export const ArmorHeader = ({ slug, name, version }: ArmorHeaderProps) => {
  const t = useTranslations('armor.page');

  return (
    <header className={s.root}>
      <Link className={buttonVariants({ variant: 'ghost', size: 'sm' })} href={ROUTES.tank(slug)}>
        <ArrowLeft aria-hidden size={16} />
        {t('back')}
      </Link>
      <p className={s.eyebrow}>{t('eyebrow')}</p>
      <h1 className={s.title}>{name ?? t('fallbackTitle')}</h1>
      {version && <p className={s.version}>{t('version', { version })}</p>}
    </header>
  );
};
