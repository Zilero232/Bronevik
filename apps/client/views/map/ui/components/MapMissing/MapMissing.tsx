'use client';

import { Map as MapIcon, RotateCcw } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, EmptyState } from '@/ui-kit';

import type { MapMissingProps } from './MapMissing.types';

import s from './MapMissing.module.scss';

export const MapMissing = ({ id, reason, onRetry }: MapMissingProps) => {
  const t = useTranslations('maps.missing');

  return (
    <EmptyState
      action={
        <div className={s.actions}>
          {reason === 'error' && (
            <Button variant='secondary' onClick={onRetry}>
              <RotateCcw size={16} />
              {t('retry')}
            </Button>
          )}
          <Link className={buttonVariants({ variant: reason === 'error' ? 'ghost' : 'secondary' })} href={ROUTES.maps}>
            <MapIcon size={16} />
            {t('toMaps')}
          </Link>
        </div>
      }
      code={reason === 'error' ? 'ERR' : '404'}
      description={t(`${reason}Description`, { id })}
      title={t(`${reason}Title`)}
    />
  );
};
