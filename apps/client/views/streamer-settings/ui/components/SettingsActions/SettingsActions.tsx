'use client';

import { Check, Copy, Download, GitCompareArrows } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ApplySettings } from '@/features/streamer/apply-settings';
import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { SettingsActionsProps } from './SettingsActions.types';

import { STREAMER_SETTINGS_PAGE } from '../../../config';
import { useSettingsActions } from '../../../model/hooks';

import s from './SettingsActions.module.scss';

export const SettingsActions = ({ view }: SettingsActionsProps) => {
  const t = useTranslations('streamerSettings.page');
  const { copied, onCopy, onDownload } = useSettingsActions(view);

  return (
    <div className={s.root}>
      <Button size='sm' variant='secondary' onClick={onCopy}>
        {copied ? <Check size={STREAMER_SETTINGS_PAGE.iconSize} /> : <Copy size={STREAMER_SETTINGS_PAGE.iconSize} />}
        {t('copy')}
      </Button>
      <Button size='sm' variant='secondary' onClick={onDownload}>
        <Download size={STREAMER_SETTINGS_PAGE.iconSize} />
        {t('download')}
      </Button>
      <ApplySettings settings={view.settings} slug={view.slug} />
      <Link
        className={buttonVariants({ variant: 'ghost', size: 'sm' })}
        href={{ pathname: ROUTES.streamers.settings.compare, query: { a: view.slug } }}
      >
        <GitCompareArrows size={STREAMER_SETTINGS_PAGE.iconSize} />
        {t('compare')}
      </Link>
    </div>
  );
};
