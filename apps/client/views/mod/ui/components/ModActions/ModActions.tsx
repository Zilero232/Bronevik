'use client';

import { Download, ExternalLink } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge, buttonVariants } from '@/ui-kit';

import { MOD_PAGE } from '../../../config';
import { useModPage } from '../../../model/hooks';

import s from './ModActions.module.scss';

export const ModActions = () => {
  const t = useTranslations('mod.hero');
  const { downloadUrl, fileName, mostUrl } = useModPage();

  return (
    <div className={s.root}>
      <div className={s.buttons}>
        <a className={buttonVariants({ variant: 'primary', size: 'lg' })} download={fileName} href={downloadUrl}>
          <Download aria-hidden size={MOD_PAGE.iconSize} />
          {t('download')}
        </a>
        {mostUrl ? (
          <a className={buttonVariants({ variant: 'secondary', size: 'lg' })} href={mostUrl} rel='noreferrer' target='_blank'>
            <ExternalLink aria-hidden size={MOD_PAGE.iconSize} />
            {t('most')}
          </a>
        ) : (
          <Badge tone='steel'>{t('mostPending')}</Badge>
        )}
      </div>
      <p className={s.file}>{t('file', { file: fileName })}</p>
    </div>
  );
};
