'use client';

import { Download, ExternalLink, PackageOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge, buttonVariants } from '@/ui-kit';

import { MOD_PAGE } from '../../../config';
import { useModPage } from '../../../model/hooks';

import s from './ModActions.module.scss';

export const ModActions = () => {
  const t = useTranslations('mod.hero');
  const { distribution } = useModPage();

  return (
    <div className={s.root}>
      <div className={s.buttons}>
        <a className={buttonVariants({ variant: 'primary', size: 'lg' })} download={distribution.managerFileName} href={distribution.managerUrl}>
          <Download aria-hidden size={MOD_PAGE.iconSize} />
          {t('download')}
        </a>
        <a className={buttonVariants({ variant: 'secondary', size: 'lg' })} download={distribution.packagesFileName} href={distribution.packagesUrl}>
          <PackageOpen aria-hidden size={MOD_PAGE.iconSize} />
          {t('manual')}
        </a>
        {distribution.mostUrl ? (
          <a className={buttonVariants({ variant: 'ghost', size: 'lg' })} href={distribution.mostUrl} rel='noreferrer' target='_blank'>
            <ExternalLink aria-hidden size={MOD_PAGE.iconSize} />
            {t('most')}
          </a>
        ) : (
          <Badge tone='steel'>{t('mostPending')}</Badge>
        )}
      </div>
      <p className={s.file}>{t('file', { file: distribution.managerFileName })}</p>
      <p className={s.file}>{t('manualFile', { file: distribution.packagesFileName })}</p>
    </div>
  );
};
