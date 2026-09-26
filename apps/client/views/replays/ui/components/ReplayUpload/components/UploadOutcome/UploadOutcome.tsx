'use client';

import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants } from '@/ui-kit';

import type { UploadOutcomeProps } from './UploadOutcome.types';

import s from './UploadOutcome.module.scss';

export const UploadOutcome = ({ phase, uploadedId, uploadError, parseError, onReset }: UploadOutcomeProps) => {
  const t = useTranslations('replays.upload');

  if (phase === 'parsed' && uploadedId) {
    return (
      <div className={s.root}>
        <Link className={buttonVariants({ size: 'sm' })} href={ROUTES.replay(uploadedId)}>
          {t('open')}
        </Link>
        <Button size='sm' variant='ghost' onClick={onReset}>
          {t('another')}
        </Button>
      </div>
    );
  }

  if (phase !== 'failed') {
    return null;
  }

  return (
    <div className={s.root}>
      <p className={s.error} role='alert'>
        {parseError ? t('parseFailed') : t(`errors.${uploadError ?? 'unknown'}`)}
      </p>
      {parseError && uploadedId && (
        <Link className={buttonVariants({ size: 'sm', variant: 'secondary' })} href={ROUTES.replay(uploadedId)}>
          {t('open')}
        </Link>
      )}
      <Button size='sm' variant='ghost' onClick={onReset}>
        {t('another')}
      </Button>
    </div>
  );
};
