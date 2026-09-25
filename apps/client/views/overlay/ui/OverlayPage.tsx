'use client';

import { useTranslations } from 'next-intl';
import { match, P } from 'ts-pattern';

import { overlayPublicIdSchema } from '@/shared/api/streamers';

import type { OverlayPageProps } from './OverlayPage.types';

import { useOverlayFeed, usePreviewPatch } from '../model/hooks';
import { OverlayStage } from './components';

import s from './OverlayPage.module.scss';

export const OverlayPage = ({ publicId }: OverlayPageProps) => {
  const t = useTranslations('overlay');
  const patch = usePreviewPatch();
  const { data, isError } = useOverlayFeed({ publicId, isEnabled: overlayPublicIdSchema.safeParse(publicId).success });

  const isValid = overlayPublicIdSchema.safeParse(publicId).success;

  return (
    <div className={s.root}>
      {match({ isValid, data, isError })
        .with({ isValid: false }, () => <p className={s.notice}>{t('error.invalid')}</p>)
        .with({ data: P.nonNullable }, ({ data: loaded }) => <OverlayStage data={loaded} patch={patch} />)
        .with({ isError: true }, () => <p className={s.notice}>{t('error.unavailable')}</p>)
        .otherwise(() => null)}
      <span className={s.attribution}>{t('attribution')}</span>
    </div>
  );
};
