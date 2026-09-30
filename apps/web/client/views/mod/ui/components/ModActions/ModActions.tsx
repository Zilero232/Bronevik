'use client';

import { Download, ExternalLink, PackageOpen } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Badge, buttonVariants } from '@/ui-kit';

import { MOD_PAGE } from '../../../config';
import { useModPage } from '../../../model/hooks';
import { DownloadLink } from './components';

import s from './ModActions.module.scss';

export const ModActions = () => {
  const t = useTranslations('mod.hero');
  const { distribution, downloads } = useModPage();

  return (
    <div className={s.root}>
      <div className={s.buttons}>
        <DownloadLink
          hasShine
          file={downloads.manager}
          fileName={distribution.managerFileName}
          href={distribution.managerUrl}
          icon={Download}
          label={t('download')}
          variant='primary'
        />
        <DownloadLink
          file={downloads.modpack}
          fileName={distribution.packagesFileName}
          href={distribution.packagesUrl}
          icon={PackageOpen}
          label={t('manual')}
          variant='secondary'
        />
        {distribution.mostUrl ? (
          <a className={buttonVariants({ variant: 'ghost', size: 'lg' })} href={distribution.mostUrl} rel='noreferrer' target='_blank'>
            <ExternalLink aria-hidden size={MOD_PAGE.iconSize} />
            {t('most')}
          </a>
        ) : (
          <Badge tone='steel'>{t('mostPending')}</Badge>
        )}
      </div>
      <div className={s.status}>
        {downloads.isPreparing && (
          <p className={s.note} role='status'>
            {t('preparing')}
          </p>
        )}
        {downloads.manager && <p className={s.file}>{t('file', { file: distribution.managerFileName, ...downloads.manager })}</p>}
        {downloads.modpack && <p className={s.file}>{t('manualFile', { file: distribution.packagesFileName, ...downloads.modpack })}</p>}
      </div>
    </div>
  );
};
