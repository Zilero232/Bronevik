'use client';

import { useTranslations } from 'next-intl';

import { useLestaLinkError } from '../../../../../model/hooks';

import s from './LestaLinkError.module.scss';

export const LestaLinkError = () => {
  const t = useTranslations('me.accounts.linkErrors');
  const linkError = useLestaLinkError();

  if (!linkError) {
    return null;
  }

  return (
    <p className={s.error} role='alert'>
      {t(linkError)}
    </p>
  );
};
