'use client';

import { Download, ExternalLink, LayoutGrid } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTE_ANCHORS } from '@/shared/constants';
import { Badge, buttonVariants } from '@/ui-kit';

import { MOD_PAGE } from '../../../config';
import { useModDownloads } from '../../../model/hooks';
import { DownloadLink } from '../DownloadLink';

import s from './ModActions.module.scss';

export const ModActions = () => {
  const t = useTranslations('mod.hero');
  const { distribution, isPreparing, manager, modpack, game } = useModDownloads();

  return (
    <div className={s.root}>
      <div className={s.buttons}>
        <DownloadLink
          hasShine
          file={manager}
          fileName={distribution.managerFileName}
          href={distribution.managerUrl}
          icon={Download}
          label={t('download')}
          variant='primary'
        />
        <a className={buttonVariants({ variant: 'secondary', size: 'lg' })} href={`#${ROUTE_ANCHORS.modFeatures}`}>
          <LayoutGrid aria-hidden size={MOD_PAGE.iconSize} />
          {t('inside')}
        </a>
      </div>
      <div className={s.status}>
        {isPreparing && (
          <p className={s.note} role='status'>
            {t('preparing')}
          </p>
        )}
        {manager && (
          <p className={s.meta}>
            <span className={s.part}>{t('file', manager)}</span>
            {game && <span className={s.part}>{t('game', { game })}</span>}
          </p>
        )}
        <p className={s.meta}>
          {modpack && (
            <span className={s.part}>
              <a className={s.link} download={distribution.packagesFileName} href={distribution.packagesUrl} rel='noreferrer' target='_blank'>
                {t('manual')}
              </a>{' '}
              {t('manualFile', { file: distribution.packagesFileName, ...modpack })}
            </span>
          )}
          <span className={s.most}>
            {distribution.mostUrl ? (
              <a className={s.link} href={distribution.mostUrl} rel='noreferrer' target='_blank'>
                {t('most')}
                <ExternalLink aria-hidden size={MOD_PAGE.smallIconSize} />
              </a>
            ) : (
              <Badge tone='steel'>{t('mostPending')}</Badge>
            )}
          </span>
        </p>
      </div>
    </div>
  );
};
