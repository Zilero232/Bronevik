'use client';

import { KeySquare, LogIn } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Link } from '@/shared/i18n/navigation';
import { buttonVariants } from '@/ui-kit';

import { MOD_PAGE } from '../../../../../config';
import { useModBind } from '../../../../../model/hooks';

import s from './ModBind.module.scss';

export const ModBind = () => {
  const t = useTranslations('mod.bind');
  const { isSignedIn, bindHref } = useModBind();

  return (
    <div className={s.root}>
      <div className={s.copy}>
        <h3 className={s.title}>{t('title')}</h3>
        <p className={s.text}>{t('text')}</p>
      </div>
      <Link className={buttonVariants({ variant: 'primary' })} href={bindHref}>
        {isSignedIn ? <KeySquare aria-hidden size={MOD_PAGE.iconSize} /> : <LogIn aria-hidden size={MOD_PAGE.iconSize} />}
        {isSignedIn ? t('signedIn') : t('signIn')}
      </Link>
    </div>
  );
};
