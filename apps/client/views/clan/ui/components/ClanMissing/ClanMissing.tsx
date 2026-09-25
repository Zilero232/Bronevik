'use client';

import { RotateCcw, Shield } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { ROUTES } from '@/shared/constants';
import { Link } from '@/shared/i18n/navigation';
import { Button, buttonVariants, EmptyState } from '@/ui-kit';

import type { ClanMissingProps } from './ClanMissing.types';

import s from './ClanMissing.module.scss';

export const ClanMissing = ({ tag, reason, onRetry }: ClanMissingProps) => {
  const t = useTranslations('clans.missing');

  return (
    <div className={s.root}>
      <EmptyState
        action={
          <div className={s.actions}>
            {reason === 'error' && (
              <Button variant='secondary' onClick={onRetry}>
                <RotateCcw size={16} />
                {t('retry')}
              </Button>
            )}
            <Link className={buttonVariants({ variant: reason === 'error' ? 'ghost' : 'secondary' })} href={ROUTES.clans}>
              <Shield size={16} />
              {t('toClans')}
            </Link>
          </div>
        }
        code={reason === 'error' ? 'ERR' : '404'}
        description={t(`${reason}Description`, { tag })}
        title={t(`${reason}Title`)}
      />
    </div>
  );
};
