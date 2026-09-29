'use client';

import { Download, ExternalLink, PackageOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge, Button, buttonVariants } from '@/ui-kit';

import { MOD_PAGE } from '../../../config';
import { useModPage } from '../../../model/hooks';

import s from './ModActions.module.scss';

export const ModActions = () => {
  const t = useTranslations('mod.hero');
  const { distribution, downloads } = useModPage();

  return (
    <div className={s.root}>
      <div className={s.buttons}>
        {downloads.manager ? (
          <a
            className={buttonVariants({ variant: 'primary', size: 'lg', shine: true })}
            download={distribution.managerFileName}
            href={distribution.managerUrl}
            rel='noreferrer'
            target='_blank'
          >
            <Download aria-hidden size={MOD_PAGE.iconSize} />
            {t('download')}
          </a>
        ) : (
          <Button disabled size='lg' variant='primary'>
            <Download aria-hidden size={MOD_PAGE.iconSize} />
            {t('download')}
          </Button>
        )}
        {downloads.modpack ? (
          <a
            className={buttonVariants({ variant: 'secondary', size: 'lg' })}
            download={distribution.packagesFileName}
            href={distribution.packagesUrl}
            rel='noreferrer'
            target='_blank'
          >
            <PackageOpen aria-hidden size={MOD_PAGE.iconSize} />
            {t('manual')}
          </a>
        ) : (
          <Button disabled size='lg' variant='secondary'>
            <PackageOpen aria-hidden size={MOD_PAGE.iconSize} />
            {t('manual')}
          </Button>
        )}
        {distribution.mostUrl ? (
          <a className={buttonVariants({ variant: 'ghost', size: 'lg' })} href={distribution.mostUrl} rel='noreferrer' target='_blank'>
            <ExternalLink aria-hidden size={MOD_PAGE.iconSize} />
            {t('most')}
          </a>
        ) : (
          <Badge tone='steel'>{t('mostPending')}</Badge>
        )}
      </div>
      {downloads.isPreparing && (
        <p className={s.note} role='status'>
          {t('preparing')}
        </p>
      )}
      {downloads.manager && <p className={s.file}>{t('file', { file: distribution.managerFileName, ...downloads.manager })}</p>}
      {downloads.modpack && <p className={s.file}>{t('manualFile', { file: distribution.packagesFileName, ...downloads.modpack })}</p>}
    </div>
  );
};
