'use client';

import { useTranslations } from 'next-intl';

import { useShowcaseUsage } from '../../../../../model/hooks';

import s from './ShowcaseNotice.module.scss';

export const ShowcaseNotice = () => {
  const t = useTranslations('builds.showcase');
  const usage = useShowcaseUsage();

  if (!usage || usage.isEnough) {
    return null;
  }

  return <p className={s.root}>{t('notEnough', { battles: usage.battles, min: usage.minSample })}</p>;
};
