'use client';

import { useTranslations } from 'next-intl';

import { Button } from '@/ui-kit';

import { useRecommendedPreset } from '../../../model/hooks';

import s from './PresetNotice.module.scss';

export const PresetNotice = () => {
  const t = useTranslations('builds.recommended');
  const { status, battles, minSample, onDismiss } = useRecommendedPreset();

  if (status === null) {
    return null;
  }

  return (
    <div className={s.root} data-status={status} role='status'>
      <span className={s.text}>{status === 'missing' ? t('missing', { battles, min: minSample }) : t(status)}</span>
      {status !== 'loading' && (
        <Button size='sm' variant='ghost' onClick={onDismiss}>
          {t('dismiss')}
        </Button>
      )}
    </div>
  );
};
